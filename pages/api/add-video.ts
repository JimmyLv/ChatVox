import { makeSummaryChain } from '@/lib/langchain/makeSummaryChain'
import { reduceDocuments } from '@/lib/langchain/reduceDocuments'
import { SubtitleMetadata } from '@/lib/langchain/SRTLoader'
import { supabaseClient } from '@/lib/supabase/client'
import { getVideoByUrl } from '@/lib/supabase/video'
import getVideoId from 'get-video-id'
import { Document } from 'langchain/document'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { SupabaseVectorStore } from 'langchain/vectorstores/supabase'
import { NextApiRequest, NextApiResponse } from 'next'
// @ts-ignore
import { getSubtitles } from 'youtube-captions-scraper'

// import ytdl from 'ytdl-core'

interface YoutubeSubtitle {
  text: string
  dur: string
  start: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.body
  if (!url) {
    return res.status(400).json({ message: 'No video url in the request' })
  }
  const { id, service } = getVideoId(url)
  if (service !== 'youtube') {
    return res.status(400).json({ message: 'Not support' })
  }

  const videoUrl = `https://www.youtube.com/watch?v=${id}`
  const existingContent = await getVideoByUrl(videoUrl)
  console.log(`========get cached subtitles for ${videoUrl}========`, existingContent?.length)

  const summaryChain = await makeSummaryChain()
  if (existingContent && existingContent.length) {
    const cachedDocs = existingContent.map(
      (doc) =>
        new Document<SubtitleMetadata>({
          pageContent: doc.content,
          metadata: doc.metadata,
        })
    )

    // TODO: should fetch cached summary directly
    const summaryResult = await summaryChain.call({
      input_documents: reduceDocuments(cachedDocs, 5, 0),
    })
    console.log('---------summary result (not cached)==========', summaryResult)

    return res.json({
      success: true,
      subtitleDocs: cachedDocs,
      summary: summaryResult.text,
      // videoInfo: info,
    })
  }

  try {
    const subtitles: YoutubeSubtitle[] = await getSubtitles({ videoID: id })

    if (subtitles) {
      // 1. prepare subtitle docs
      const rawDocs: Document<SubtitleMetadata>[] = subtitles.map(
        ({ text, dur, start }, index) => ({
          pageContent: text,
          metadata: {
            index,
            start: Number(start),
            end: Number(start) + Number(dur),
            source: videoUrl,
          },
        })
      )

      // 2. generate summary
      const summaryResult = await summaryChain.call({
        input_documents: reduceDocuments(rawDocs, 100, 5),
      })
      console.log('---------summary result (not cached)==========', summaryResult)

      // 3. store embedding vector to supabase
      const vectorStore = new SupabaseVectorStore(new OpenAIEmbeddings(), {
        client: supabaseClient,
      })
      const docs = reduceDocuments(rawDocs)
      await vectorStore.addDocuments(docs)

      // 4. return result to frontend
      return res.json({
        success: true,
        subtitleDocs: docs,
        summary: summaryResult.text,
        // videoInfo: info,
      })
    }

    // TODO: add doc for different video, use whisper to generate subtitle
  } catch (error: any) {
    console.error(error)
    // https://www.youtube.com/watch?v=0e9S_Gm7Slc
    res.status(500).json({ error, errorMessage: error.message })
  }
}

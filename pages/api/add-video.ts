import { extractDataFromSrt } from '@/lib/langchain/extractSrt'
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
  const videoUrl = `https://www.youtube.com/watch?v=${id}`

  const existingContent = await getVideoByUrl(videoUrl)
  console.log(`========subtitles for ${videoUrl}========`, existingContent?.length)

  const chain = await makeSummaryChain()
  if (existingContent && existingContent.length) {
    const docs = existingContent.map(
      (doc) =>
        new Document<SubtitleMetadata>({
          pageContent: doc.content,
          metadata: doc.metadata,
        })
    )

    const result = await chain.call({
      input_documents: docs,
    })
    console.log('---------summary result (not cached)==========', result)

    return res.json({
      success: true,
      subtitleDocs: docs,
      summary: result.text,
      // videoInfo: info,
    })
  }

  if (service !== 'youtube') {
    return res.status(400).json({ message: 'Not support' })
  }

  try {
    const subtitles: YoutubeSubtitle[] = await getSubtitles({ videoID: id })
    const embeddings = new OpenAIEmbeddings()
    const vectorStore = new SupabaseVectorStore(embeddings, { client: supabaseClient })

    if (subtitles) {
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
      const docs = reduceDocuments(rawDocs)
      await vectorStore.addDocuments(docs)

      const result = await chain.call({
        input_documents: docs,
      })
      console.log('---------summary result (not cached)==========', result)

      return res.json({
        success: true,
        subtitleDocs: docs,
        summary: result.text,
        // videoInfo: info,
      })
    }

    // TODO: add doc for different video, use whisper to generate subtitle
    const rawDocs = await extractDataFromSrt(
      "public/assets/Steve Jobs' 2005 Stanford Commencement Address (with intro by President John Hennessy) - English (auto-generated).srt"
    )
    const docs = reduceDocuments(rawDocs)
    // console.log('========docs========', docs)
    // await vectorStore.addDocuments(docs)

    return res.json({
      success: true,
      subtitleDocs: docs,
    })
  } catch (error: any) {
    console.error(error)
    // https://www.youtube.com/watch?v=0e9S_Gm7Slc
    res.status(500).json({ error, errorMessage: error.message })
  }
}

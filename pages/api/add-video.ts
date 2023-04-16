import { extractDataFromSrt } from '@/lib/langchain/extractSrt'
import { reduceDocuments } from '@/lib/langchain/reduceDocuments'
import { SubtitleMetadata } from '@/lib/langchain/SRTLoader'
import { supabaseClient } from '@/lib/supabase/client'
import { getVideoByUrl } from '@/lib/supabase/video'
import { info } from 'autoprefixer'
import { Document } from 'langchain/document'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { SupabaseVectorStore } from 'langchain/vectorstores/supabase'
import { NextApiRequest, NextApiResponse } from 'next'
// @ts-ignore
import { getSubtitles } from 'youtube-captions-scraper'
import getVideoId from 'get-video-id'
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
  const existingContent = await getVideoByUrl(url)
  if (existingContent) {
    return res.json({
      success: true,
      subtitleDocs: existingContent.map((doc) => ({
        pageContent: doc.content,
        metadata: doc.metadata,
      })),
      // videoInfo: info,
    })
  }

  const { id, service } = getVideoId(url)
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
            source: url,
          },
        })
      )
      const docs = reduceDocuments(rawDocs)
      await vectorStore.addDocuments(docs)

      return res.json({
        success: true,
        subtitleDocs: docs,
        // videoInfo: info,
      })
    }

    // TODO: add doc for different video, use whisper to generate subtitle
    const docs = await extractDataFromSrt(
      "public/assets/Steve Jobs' 2005 Stanford Commencement Address (with intro by President John Hennessy) - English (auto-generated).srt"
    )
    console.log('========docs========', docs)
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

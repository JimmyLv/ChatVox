import { extractDataFromSrt } from '@/lib/langchain/extractSrt'
import { reduceDocuments } from '@/lib/langchain/reduceDocuments'
import { SubtitleMetadata } from '@/lib/langchain/SRTLoader'
import { supabaseClient } from '@/lib/supabase/client'
import { Document } from 'langchain/document'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { SupabaseVectorStore } from 'langchain/vectorstores/supabase'
import { NextApiRequest, NextApiResponse } from 'next'
// @ts-ignore
import { getSubtitles } from 'youtube-captions-scraper'
import getVideoId from 'get-video-id'

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

  const sub: YoutubeSubtitle[] = await getSubtitles({
    videoID: id,
  })
  console.log('========sub========', sub)
  // {
  //     start: '229.28',
  //     dur: '3.44',
  //     text: 'i decided to take a calligraphy class to'
  //   },
  const embeddings = new OpenAIEmbeddings()
  const vectorStore = new SupabaseVectorStore(embeddings, { client: supabaseClient })

  if (sub) {
    const rawDocs: Document<SubtitleMetadata>[] = sub.map(({ text, dur, start }, index) => ({
      pageContent: text,
      metadata: {
        index,
        start: Number(start),
        end: Number(start) + Number(dur),
        source: url,
      },
    }))
    const docs = reduceDocuments(rawDocs)
    await vectorStore.addDocuments(docs)

    return res.json({
      success: true,
    })
  }

  // TODO: add doc for different video, use whisper to generate subtitle
  const docs = await extractDataFromSrt(
    "public/assets/Steve Jobs' 2005 Stanford Commencement Address (with intro by President John Hennessy) - English (auto-generated).srt"
  )
  // console.log('========docs========', docs)
  await vectorStore.addDocuments(docs)

  return res.json({
    success: true,
  })
}

import { SubtitleMetadata } from '@/lib/langchain/SRTLoader'
import { Document } from 'langchain/document'
import { supabaseClient } from '@/lib/supabase/client'
import getVideoId from 'get-video-id'
import type { NextApiRequest, NextApiResponse } from 'next'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { SupabaseVectorStore } from 'langchain/vectorstores/supabase'
import { makeChain } from '@/lib/langchain/makechain'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { videoId, question, history } = req.body

  if (!question) {
    return res.status(400).json({ message: 'No question in the request' })
  }
  // OpenAI recommends replacing newlines with spaces for best results
  const sanitizedQuestion = question.trim().replaceAll('\n', ' ')

  /* create vectorStore*/
  const vectorStore = await SupabaseVectorStore.fromExistingIndex(new OpenAIEmbeddings(), {
    client: supabaseClient,
  })

  // const onTokenStream = (token: string) => {
  //   sendData(JSON.stringify({ data: token }))
  // }
  const chain = makeChain(vectorStore)

  try {
    const { text, sourceDocuments } = await chain.call({
      question: sanitizedQuestion,
      chat_history: history || [],
    })

    const filteredSources = sourceDocuments.filter((i: Document<SubtitleMetadata>) => {
      const { id: sourceId } = getVideoId(i.metadata.source as string)
      return videoId === sourceId
    })
    console.log('===question & response & sources===', { question, answer: text, filteredSources })
    res.json({ answer: text, sources: filteredSources })
  } catch (error) {
    console.log('error', error)
    res.status(500).json({ error })
  }
}

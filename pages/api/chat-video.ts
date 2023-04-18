import { supabaseClient } from '@/lib/supabase/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { SupabaseVectorStore } from 'langchain/vectorstores'
import { makeChain } from '@/lib/langchain/makechain'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { question, history } = req.body

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
    const sources = await vectorStore.similaritySearch(sanitizedQuestion, 5, (...args: any[]) =>
      console.log('========args========', args)
    )
    const response = await chain.call({
      question: sanitizedQuestion,
      chat_history: history || [],
    })

    console.log('===question & response===', { question, response })
    res.json({ answer: response.text, sources })
  } catch (error) {
    console.log('error', error)
    res.status(500).json({ error })
  }
}

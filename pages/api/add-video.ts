import { extractDataFromSrt } from '@/lib/langchain/extractSrt'
import { supabaseClient } from '@/lib/supabase/client'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { SupabaseVectorStore } from 'langchain/vectorstores/supabase'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const embeddings = new OpenAIEmbeddings()
  const vectorStore = new SupabaseVectorStore(embeddings, { client: supabaseClient })

  // TODO: add doc for different video
  const docs = await extractDataFromSrt(
    "public/assets/Steve Jobs' 2005 Stanford Commencement Address (with intro by President John Hennessy) - English (auto-generated).srt"
  )
  // console.log('========docs========', docs)
  await vectorStore.addDocuments(docs)

  return res.json({
    success: true,
  })
}

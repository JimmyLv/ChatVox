import { extractDataFromSrt } from '@/lib/langchain/extractSrt'
import { supabaseClient } from '@/lib/supabase/client'
import { loadQAStuffChain } from 'langchain/chains'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { OpenAIChat } from 'langchain/llms/openai'
import { SupabaseHybridSearch } from 'langchain/retrievers/supabase'
import { SupabaseVectorStore } from 'langchain/vectorstores/supabase'
import { NextApiRequest, NextApiResponse } from 'next'

// https://js.langchain.com/docs/modules/indexes/document_loaders/examples/file_loaders/subtitles
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const embeddings = new OpenAIEmbeddings()
  const vectorStore = new SupabaseVectorStore(embeddings, { client: supabaseClient })

  const docs = await extractDataFromSrt(
    "public/assets/Steve Jobs' 2005 Stanford Commencement Address (with intro by President John Hennessy) - English (auto-generated).srt"
  )
  await vectorStore.addDocuments(docs)

  const retriever = new SupabaseHybridSearch(embeddings, {
    client: supabaseClient,
    //  Below are the defaults, expecting that you set up your supabase table and functions according to the guide above. Please change if necessary.
    similarityK: 2,
    keywordK: 2,
    tableName: 'documents',
    similarityQueryName: 'match_documents',
    keywordQueryName: 'kw_match_documents',
  })

  const query = req.body.query || 'What stories did Jobs tell?'

  const relevantResults = await retriever.getRelevantDocuments(query)

  console.log({ relevantResults })

  // ----
  const searchResults = await vectorStore.similaritySearch(query, 5)

  console.log({ searchResults })

  // ---

  // const searchResults = await docSearch.similaritySearch(query, 5);

  const llm = new OpenAIChat({
    // temperature: 0.7,
    maxTokens: 400,
  })
  const chain = loadQAStuffChain(llm)
  const response = await chain.call({
    input_documents: relevantResults,
    question: query,
  })

  return res.json({ answer: response, relevantResults, searchResults })
}

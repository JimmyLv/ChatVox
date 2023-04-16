import { supabaseClient } from '@/lib/supabase/client'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { SupabaseHybridSearch } from 'langchain/retrievers/supabase'
import { SupabaseVectorStore } from 'langchain/vectorstores/supabase'
import { NextApiRequest, NextApiResponse } from 'next'
import { NextRequest } from 'next/server'

// https://js.langchain.com/docs/modules/indexes/document_loaders/examples/file_loaders/subtitles
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const embeddings = new OpenAIEmbeddings()

  const retriever = new SupabaseHybridSearch(embeddings, {
    client: supabaseClient,
    //  Below are the defaults, expecting that you set up your supabase table and functions according to the guide above. Please change if necessary.
    similarityK: 2,
    keywordK: 2,
    tableName: 'documents',
    similarityQueryName: 'match_documents',
    keywordQueryName: 'kw_match_documents',
  })

  const results = await retriever.getRelevantDocuments('hello bye')

  console.log(results)

  // ----

  const vectorStore = await SupabaseVectorStore.fromTexts(
    ['Hello world', 'Bye bye', "What's this?"],
    [{ id: 2 }, { id: 1 }, { id: 3 }],
    embeddings,
    {
      client: supabaseClient,
      tableName: 'documents',
      queryName: 'match_documents',
    }
  )

  const resultOne = await vectorStore.similaritySearch('Hello world', 1)

  console.log(resultOne)

  return res.json({ results, resultOne })
}

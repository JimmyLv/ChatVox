import { supabaseClient } from '@/lib/supabase/client'
// import { loadQAStuffChain, loadQAMapReduceChain, loadSummarizationChain } from 'langchain/chains'
import { loadQAStuffChain } from 'langchain/chains'
import { Document } from 'langchain/document'
import { SRTLoader } from 'langchain/document_loaders/fs/srt'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { OpenAI } from 'langchain/llms/openai'
import { SupabaseHybridSearch } from 'langchain/retrievers/supabase'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { SupabaseVectorStore } from 'langchain/vectorstores/supabase'
import { NextApiRequest, NextApiResponse } from 'next'

async function splitDocsIntoChunks(docs: Document[]): Promise<Document[]> {
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 2000,
    chunkOverlap: 200,
  })
  return await textSplitter.splitDocuments(docs)
}

// https://js.langchain.com/docs/modules/indexes/document_loaders/examples/file_loaders/subtitles
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const embeddings = new OpenAIEmbeddings()
  const vectorStore = new SupabaseVectorStore(embeddings, { client: supabaseClient })

  const loader = new SRTLoader(
    "public/assets/Steve Jobs' 2005 Stanford Commencement Address (with intro by President John Hennessy) - English (auto-generated).srt"
  )

  const rawDocs = await loader.load()
  const docs = await splitDocsIntoChunks(rawDocs)
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

  console.log('========req.body.query========', req.body.query)
  const query = req.body.query || 'What stories did Jobs tell?'

  const relevantResults = await retriever.getRelevantDocuments(query)

  console.log({ relevantResults })

  // ----
  const searchResults = await vectorStore.similaritySearch(query, 5)

  console.log({ searchResults })

  // ---

  // const searchResults = await docSearch.similaritySearch(query, 5);

  const llm = new OpenAI({
    // temperature: 0.7,
  })
  const chain = loadQAStuffChain(llm)
  const response = await chain.call({
    input_documents: relevantResults,
    question: query,
  })

  return res.json({ answer: response, relevantResults, searchResults })
}

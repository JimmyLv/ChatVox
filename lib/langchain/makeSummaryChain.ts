import { loadSummarizationChain } from 'langchain/chains'
import { OpenAIChat } from 'langchain/llms/openai'

export async function makeSummaryChain() {
  // In this example, we use a `MapReduceDocumentsChain` specifically prompted to summarize a set of documents.
  const model = new OpenAIChat({
    temperature: 0.2,
    verbose: true,
    maxConcurrency: 3,
    maxRetries: 1,
    maxTokens: 400,
  })

  // This convenience function creates a document chain prompted to summarize a set of documents.
  return loadSummarizationChain(model, { type: 'map_reduce' })
}

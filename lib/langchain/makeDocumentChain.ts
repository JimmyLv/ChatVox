import { loadQARefineChain } from 'langchain/chains'
import { OpenAIChat } from 'langchain/llms/openai'

export async function makeDocumentChain() {
  // Create the models and chain
  const llm = new OpenAIChat({
    temperature: 0.2,
    maxTokens: 400,
  })

  return loadQARefineChain(llm)
}

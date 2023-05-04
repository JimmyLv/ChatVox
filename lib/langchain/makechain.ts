import { CONDENSE_PROMPT, QA_PROMPT } from '@/lib/langchain/prompts'
import { CallbackManager, ConsoleCallbackHandler } from 'langchain/callbacks'
import { ChatVectorDBQAChain, LLMChain, loadQAStuffChain } from 'langchain/chains'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { SupabaseVectorStore } from 'langchain/vectorstores/supabase'

export const makeChain = (
  vectorStore: SupabaseVectorStore,
  onTokenStream?: (token: string, verbose?: boolean) => void
) => {
  const chat = new ChatOpenAI({
    temperature: 0.2,
  })
  const questionGenerator = new LLMChain({
    llm: chat,
    prompt: CONDENSE_PROMPT,
  })

  const callbackManager = new CallbackManager()
  callbackManager.addHandler(new ConsoleCallbackHandler())

  const docChain = loadQAStuffChain(
    new ChatOpenAI({
      temperature: 0.2,
      streaming: Boolean(onTokenStream),
      callbackManager,
    }),
    { prompt: QA_PROMPT }
  )

  // return ConversationalRetrievalQAChain.fromLLM(chat)

  return new ChatVectorDBQAChain({
    vectorstore: vectorStore,
    combineDocumentsChain: docChain,
    questionGeneratorChain: questionGenerator,
    returnSourceDocuments: true,
  })
}

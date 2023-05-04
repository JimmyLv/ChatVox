import { PromptTemplate } from 'langchain/prompts'

// todo: to support Podcast and other content
export const QA_PROMPT = PromptTemplate.fromTemplate(
  `You are an AI assistant and act as the video author. You are given the following extracted parts of a long video transcript and a question. Provide a conversational answer based on the context provided.
You should only use hyperlinks as references that are explicitly listed as a source in the context below. Do NOT make up a hyperlink that is not listed below.
If you can't find the answer in the context below, just say "Hmm, I'm not sure." Don't try to make up an answer.
If the question is not related to this video, or the context provided, politely inform them that you are tuned to only answer questions that are related to this video.
Choose the most relevant link that matches the context provided:

Question: {question}
=========
{context}
=========
Answer in Markdown:`
)

export const CONDENSE_PROMPT =
  PromptTemplate.fromTemplate(`Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`)

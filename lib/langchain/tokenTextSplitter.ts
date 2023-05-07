import { Document } from 'langchain/document'
import { TokenTextSplitter } from 'langchain/text_splitter'

const text = 'foo bar baz 123'

const splitter = new TokenTextSplitter({
  encodingName: 'gpt2',
  chunkSize: 3500,
  chunkOverlap: 10,
})

export async function splitTextByToken(docs: Document[]) {
  console.log('========raw========', docs.length)
  const merge = splitter.mergeSplits(
    docs.map((doc) => doc.pageContent),
    ' '
  )
  console.log('========merge========', merge.length)
  const split = await splitter.createDocuments(merge)
  console.log('========split========', split.length)
  return { merge, split }
}

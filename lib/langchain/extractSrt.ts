import { SRTLoader, SubtitleMetadata } from '@/lib/langchain/SRTLoader'
import { Document } from 'langchain/document'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'

export async function extractDataFromSrt(srtPath: string): Promise<Document<SubtitleMetadata>[]> {
  try {
    const loader = new SRTLoader(srtPath)

    const rawDocs = await loader.load()
    return rawDocs
  } catch (error) {
    console.error(`Error while extracting data from ${srtPath}: ${error}`)
    return []
  }
}

async function splitDocsIntoChunks(docs: Document[]): Promise<Document[]> {
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 2000,
    chunkOverlap: 200,
  })
  return await textSplitter.splitDocuments(docs)
}

/*
;(async function run() {
  try {
    //load data from each url
    await extractDataFromSrt(
      "public/assets/Steve Jobs' 2005 Stanford Commencement Address (with intro by President John Hennessy) - English (auto-generated).srt"
    )
  } catch (error) {
    console.log('error occured:', error)
  }
})()
*/

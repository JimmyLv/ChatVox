import { SubtitleMetadata } from '@/lib/langchain/SRTLoader'
import { encoding_for_model } from '@dqbd/tiktoken'
import { Document } from 'langchain/document'

const enc = encoding_for_model('gpt-3.5-turbo')

export function reduceDocuments(
  subtitleDocs: Document<SubtitleMetadata>[] = [],
  contextWindowSize = 20,
  contextWindowOverlap = 3
) {
  // about 2-minute subtitle

  console.log(`========raw subtitleDocs ${subtitleDocs.length}========`)
  const documents = []
  for (let i = 0; i < subtitleDocs.length; i += contextWindowSize - contextWindowOverlap) {
    const subtitlesWindow = subtitleDocs.slice(i, i + contextWindowSize)
    const pageContent = subtitlesWindow.map(({ pageContent }) => pageContent).join(' ')
    const firstSubtitle = subtitlesWindow[0]
    const lastSubtitle = subtitlesWindow[subtitlesWindow.length - 1]
    const metadata = {
      index: i,
      start: firstSubtitle.metadata.start,
      end: lastSubtitle.metadata.end,
      // startIdx: i,
      // endIdx: i + contextWindowSize,
      source: firstSubtitle.metadata.source,
    }
    const doc = new Document<SubtitleMetadata>({ pageContent, metadata })
    documents.push(doc)
  }

  console.log(
    `========reducedDocuments ${documents.length}========`,
    documents.map(({ pageContent }) => enc.encode(pageContent).length)
  )

  return documents
}

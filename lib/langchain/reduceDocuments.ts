import { SubtitleMetadata } from '@/lib/langchain/SRTLoader'
import { Document } from 'langchain/document'

export function reduceDocuments(subtitleDocs: Document<SubtitleMetadata>[] = []) {
  const contextWindowSize = 200
  const contextWindowOverlap = 50

  const documents = []
  for (let i = 0; i < subtitleDocs.length; i += contextWindowSize - contextWindowOverlap) {
    const subtitlesWindow = subtitleDocs.slice(i, i + contextWindowSize)
    const pageContent = subtitlesWindow.map(({ pageContent }) => pageContent).join(' ')
    const firstSubtitle = subtitlesWindow[0]
    const lastSubtitle = subtitlesWindow[subtitlesWindow.length - 1]
    const metadata = {
      start: firstSubtitle.metadata.start,
      end: lastSubtitle.metadata.end,
      index: firstSubtitle.metadata.index,
      // endIdx: lastSubtitle.metadata.index,
      source: firstSubtitle.metadata.source,
    }
    const doc = new Document({ pageContent, metadata })
    documents.push(doc)
  }

  return documents
}

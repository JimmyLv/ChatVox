import { SubtitleMetadata } from '@/lib/langchain/SRTLoader'
import { Document } from 'langchain/document'

export function reduceDocuments(subtitleDocs: Document<SubtitleMetadata>[] = []) {
  // console.log('========subtitleDocs========', subtitleDocs)
  // about 2-minute subtitle
  const contextWindowSize = 20
  const contextWindowOverlap = 3

  const documents = []
  for (let i = 0; i < subtitleDocs.length; i += contextWindowSize - contextWindowOverlap) {
    const subtitlesWindow = subtitleDocs.slice(i, i + contextWindowSize)
    const pageContent = subtitlesWindow.map(({ pageContent }) => pageContent).join(' ')
    const firstSubtitle = subtitlesWindow[0]
    const lastSubtitle = subtitlesWindow[subtitlesWindow.length - 1]
    const metadata = {
      start: firstSubtitle.metadata.startSeconds,
      end: lastSubtitle.metadata.endSeconds,
      startIdx: i,
      endIdx: i + contextWindowSize,
      source: firstSubtitle.metadata.source,
    }
    const doc = new Document({ pageContent, metadata })
    documents.push(doc)
  }

  return documents
}

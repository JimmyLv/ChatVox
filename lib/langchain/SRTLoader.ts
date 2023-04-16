import { TextLoader } from 'langchain/document_loaders/fs/text'
import type SRTParserT from 'srt-parser-2'

export class SRTLoader extends TextLoader {
  constructor(filePathOrBlob: string | Blob) {
    super(filePathOrBlob)
  }

  protected async parse(raw: string): Promise<string[]> {
    const { SRTParser2 } = await SRTLoaderImports()
    const parser: SRTParserT = new SRTParser2()
    const srts = parser.fromSrt(raw)
    return [
      srts
        .map((srt) => {
          return {
            start: srt.startSeconds,
            text: srt.text,
          }
        })
        .join(' '),
    ]
  }
}

async function SRTLoaderImports(): Promise<{
  // @ts-ignore
  SRTParser2: typeof SRTParserT.default
}> {
  try {
    // @ts-ignore
    const SRTParser2 = (await import('srt-parser-2')).default.default
    console.log('========SRTParser2========', SRTParser2)
    return { SRTParser2 }
  } catch (e) {
    throw new Error(
      'Please install srt-parser-2 as a dependency with, e.g. `yarn add srt-parser-2`'
    )
  }
}

import { extractDataFromSrt } from '@/lib/langchain/extractSrt'
import { reduceDocuments } from '@/lib/langchain/reduceDocuments'
import { NextApiRequest, NextApiResponse } from 'next'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const rawDocs = await extractDataFromSrt(
    'public/assets/2023年伯克希尔股东大会：巴菲特 & 芒格·年度演讲（2.7小时完整版）.srt'
  )
  const rawEnDocs = await extractDataFromSrt(
    "public/assets/Berkshire's 2023 annual shareholder meeting： Watch the full morning session [kfzp_IgA6YQ].srt"
  )

  const docs = reduceDocuments(rawDocs, 100, 5)
  const enDocs = reduceDocuments(rawEnDocs, 200, 5)
  res.json({
    success: true,
    docs,
    enDocs,
  })
}

export default handler

import { BASE_DOMAIN, CURRENT_DOMAIN } from '@/constants/site'
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  const t = (key: string) => key
  let description = t(
    `Chat With Any Video, challenge myself to complete in @Supabase AI Hackathon.`
  )
  let ogimage = `og-image.png`
  let sitename = CURRENT_DOMAIN
  let title = t('ChatVox · Chat With Any Video')

  return (
    <Html lang="en">
      <Head>
        <meta name="description" content={description} />
        <meta property="og:site_name" content={sitename} />
        <meta property="og:description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:image" content={ogimage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogimage} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

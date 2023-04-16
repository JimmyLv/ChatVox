import { isDev } from '~/utils/env'

export const getRedirectURL = () => {
  const defaultUrl = isDev ? 'http://localhost:3000/' : window.location.href

  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL || // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL || // Automatically set by Vercel.
    defaultUrl

  // Make sure to include `https://` when not localhost.
  url = url.includes('http') ? url : `https://${url}`
  // Make sure to including trailing `/`.
  url = url.charAt(url.length - 1) === '/' ? url : `${url}/`
  return url
}

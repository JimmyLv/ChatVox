export function encodeFileName(filename: string) {
  return Buffer.from(filename).toString('base64')
}
export function decodeFileName(encodedFilename: string) {
  return Buffer.from(encodedFilename, 'base64').toString()
}

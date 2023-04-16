export default function downloadFile(content: BlobPart, fileName: string, type: string, isDownloadable?: boolean) {
  // text/plain;charset=windows-1256
  const fileBlob = new Blob([content], { type })
  if (!isDownloadable) {
    const file = new File([fileBlob], fileName, {
      type: fileBlob.type,
      lastModified: new Date().getTime(),
    })
    console.log('========file========', file)
    return URL.createObjectURL(file)
  }

  const downloadLink = document.createElement('a')
  downloadLink.href = URL.createObjectURL(fileBlob)
  downloadLink.download = fileName
  downloadLink.click()
}

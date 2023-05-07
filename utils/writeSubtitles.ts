import fs from 'fs'

async function writeSubtitles(srtSubtitles: any[]) {
  const formattedSubtitles = srtSubtitles.map(function (subtitle) {
    return {
      end: subtitle.endSeconds,
      text: subtitle.text,
      index: parseInt(subtitle.id) - 1,
      startTime: subtitle.startSeconds,
    }
  })

  fs.writeFile('_subtitles.json', JSON.stringify(formattedSubtitles, null, 2), (err) => {
    if (err) {
      console.error('Error writing file:', err)
    } else {
      console.log('File successfully written.')
    }
  })
}

import { User } from '@supabase/auth-helpers-react'
import { SupabaseClient } from '@supabase/supabase-js'
import { Format, stringifySync } from 'subtitle'
import { StateCreator } from 'zustand'
import { toast } from '~/hooks/use-toast'
import { SUPABASE_FILES_STORAGE_NAME } from '~/lib/supabase/client'
import { LocalFile } from '~/schemas/file'
import downloadFile from '~/utils/files/downloadFile'
import { encodeFileName } from '~/utils/files/filename'

export interface FileSlice {
  uploading: boolean
  uploadAudioFile: (
    supabase: SupabaseClient,
    file?: File,
    user?: User | null
  ) => Promise<string | undefined>
  fileDetail?: LocalFile
  setFileDetail: (fileDetail?: LocalFile) => void
  downloadSubtitle: (format?: Format, isDownloadable?: boolean) => Promise<string | void>
  vttSubtitleUrl: string
}

export function convertFileSize(file?: File | Blob) {
  if (!file) {
    return '0MB'
  }
  return (file.size / 1024 / 1024).toFixed(2) + 'MB'
}

export const createFileSlice: StateCreator<FileSlice> = (set, getState) => ({
  vttSubtitleUrl: '',
  downloadSubtitle: async (format = 'SRT', isDownloadable) => {
    const { fileDetail } = getState()
    const subtitlesArray = fileDetail?.subtitlesArray
    if (!subtitlesArray) {
      toast({
        title: 'No subtitles found 没有找到字幕！',
      })
      return
    }
    const subtitleString = stringifySync(
      subtitlesArray.map((subtitle) => ({
        type: 'cue',
        data: {
          // timestamp in milliseconds,
          start: Number(subtitle.startTime) * 1000,
          end: Number(subtitle.end) * 1000,
          text: subtitle.text,
        },
      })),
      { format }
    )
    const fileName = `${fileDetail?.title || 'subtitle'}.${format === 'WebVTT' ? 'vtt' : 'srt'}`
    const vttSubtitleUrl = downloadFile(
      subtitleString,
      fileName,
      'text/plain;charset=windows-1256',
      isDownloadable
    )
    // console.log('========vttSubtitleUrl========', vttSubtitleUrl)
    if (vttSubtitleUrl) {
      set({
        vttSubtitleUrl,
      })
    }
    return vttSubtitleUrl
  },
  setFileDetail: (fileDetail) => set({ fileDetail }),
  uploading: false,
  uploadAudioFile: async (supabase, fileToUpload, user) => {
    if (!fileToUpload) {
      toast({ title: 'Please select a file to upload 请选择文件！' })
      return
    }

    // 假设用户已登录，并且我们可以从 supabase 获取到 user 对象
    if (!user) {
      toast({ title: 'User not logged in 用户还未登录哦！' })
      return
    }

    // 对文件名进行编码以处理特殊字符
    const fixedFileName = encodeFileName(fileToUpload.name)

    // 检查指定文件夹中是否已经存在该文件
    set({ uploading: true })
    const { data: listData, error: listError } = await supabase.storage
      .from(SUPABASE_FILES_STORAGE_NAME)
      .list(`${user.id}/`)

    if (listError) {
      toast({
        variant: 'destructive',
        title: 'Error fetching files:',
        description: listError.message,
      })
      set({ uploading: false })
      return
    }

    const existingFile = listData.find((file) => file.name === fixedFileName)

    if (existingFile) {
      toast({
        title: 'File already exists 文件已上传！',
      })
      set({ uploading: false })
      return `${user.id}/${existingFile.name}`
    } else {
      // 上传文件到 Supabase Storage
      const { data, error } = await supabase.storage
        .from(SUPABASE_FILES_STORAGE_NAME)
        .upload(`${user.id}/${fixedFileName}`, fileToUpload, {
          cacheControl: '3600',
          upsert: false,
        })
      set({ uploading: false })

      if (error) {
        toast({
          variant: 'destructive',
          title: 'Error uploading fileToUpload:',
          description: error.message,
        })
      } else {
        toast({
          title: 'File uploaded successfully 文件上传成功！',
        })
        return data?.path
      }
    }
  },
})

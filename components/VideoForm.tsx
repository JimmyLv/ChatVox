import { LoadingText } from '@/components/buttons/LoadingText'
import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/hooks/useTranslation'
import { cn } from '@/lib/utils'
import { videoConfigSchema, VideoConfigSchema } from '@/schemas/video'
import { useAppStore } from '@/store'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

const defaultVideoUrl = 'https://www.youtube.com/watch?v=UF8uR6Z6KLc'

export function VideoForm() {
  const { adding, addVideo, uploading, uploadAudioFile } = useAppStore()
  const { t } = useTranslation()

  const {
    register,
    handleSubmit,
    control,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<VideoConfigSchema>({
    resolver: zodResolver(videoConfigSchema),
  })

  const formValues = getValues()
  const { videoUrl, file, audioFile } = formValues

  const onFormSubmit: SubmitHandler<VideoConfigSchema> = async (data, e) => {
    // e?.preventDefault()
    // resetChat()

    if (file?.name) {
      // await uploadFile(audioFile)
    } else {
      if (videoUrl) {
        await addVideo(videoUrl)
      } else {
        await addVideo(defaultVideoUrl)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="grid place-items-center p-2">
      <div className="flex w-full items-end justify-between">
        <div className="flex flex-col mx-auto w-full">
          <label htmlFor="videoUrl">Please input youtube.com video link，and press Enter</label>
          <input
            type="text"
            id="videoUrl"
            {...register('videoUrl')}
            className="appearance-none rounded-md border bg-transparent mt-2 py-2 pl-2 text-sm leading-6 text-slate-900 shadow-sm ring-1 ring-slate-200 placeholder:text-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
            placeholder={defaultVideoUrl}
          />
        </div>
        <Button
          type="submit"
          className={cn(
            'mx-2 w-30 whitespace-nowrap rounded-lg py-2.5 text-sm font-medium text-white'
          )}
        >
          {adding ? (
            <LoadingText text="Adding" />
          ) : (
            <div className="flex">
              <Icons.add className="mr-2 h-5 w-5" />
              Add
            </div>
          )}
        </Button>
      </div>
    </form>
  )
}

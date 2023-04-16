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
    e?.preventDefault()
    // resetChat()

    if (file?.name) {
      // await uploadFile(audioFile)
    } else {
      videoUrl && (await addVideo(videoUrl))
    }
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="grid place-items-center p-2">
      <div className="flex w-full items-center justify-between">
        <input
          type="text"
          {...register('videoUrl')}
          className="mx-auto my-8 w-full appearance-none rounded-md border bg-transparent py-2 pl-2 text-sm leading-6 text-slate-900 shadow-sm ring-1 ring-slate-200 placeholder:text-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
          placeholder={t('Please input youtube.com video link，and press Enter')}
        />
        <Button
          type="submit"
          className={cn(
            'ml-2 w-30 whitespace-nowrap rounded-lg py-2.5 text-sm font-medium text-white'
          )}
        >
          {adding ? (
            <LoadingText text="Adding" />
          ) : (
            <div className="flex">
              Add
              <Icons.add className="ml-2 h-5 w-5" />
            </div>
          )}
        </Button>
      </div>
    </form>
  )
}

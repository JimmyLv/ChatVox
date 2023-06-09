import { z } from 'zod'
export const videoConfigSchema = z.object({
  videoUrl: z.string().optional(),
  file: z.custom<File>().optional(),
  fileType: z.string().optional(),
  filePath: z.string().optional(),
  audioFile: z.custom<File>().optional(),
})

export type VideoConfigSchema = z.infer<typeof videoConfigSchema>

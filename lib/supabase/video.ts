import { supabaseClient } from '@/lib/supabase/client'

export async function getVideoByUrl(url: string) {
  // 查询是否已经存在相同的记录
  const { data: existingContent, error } = await supabaseClient
    .from('documents')
    .select('content, metadata')
    .eq('metadata->>source', url)

  if (error) {
    console.error(error)
  }
  return existingContent
}

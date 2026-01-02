// @ts-nocheck
import { createClient } from '@/lib/supabase/server'

export async function getUserRole(userId: string) {
  const supabase = await createClient()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('roles')
    .eq('id', userId)
    .single()

  if (!profile) {
    return null
  }

  return profile.roles as string
}

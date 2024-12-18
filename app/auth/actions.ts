'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

import { createClient } from '@/utils/supabase/server'
import { getProjectId } from '@/utils/getProjectId'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function logout() {
  // Get the Supabase project ID from the environment variable
  const projectId = getProjectId();

  // Define cookie names dynamically based on the project ID
  const tokenCookieName0 = `sb-${projectId}-auth-token.0`
  const tokenCookieName1 = `sb-${projectId}-auth-token.1`

  // Get the cookie store (you need to await the cookies() promise)
  const cookieStore = await cookies()

  // Delete the session cookies by setting max-age to 0
  cookieStore.delete({
    name: tokenCookieName0,
    path: '/',
  })
  cookieStore.delete({
    name: tokenCookieName1,
    path: '/',
  })

  // Revalidate the layout to reflect the logged-out state
  revalidatePath('/', 'layout')

  // Redirect the user to the login page
  redirect('/auth/login')
}

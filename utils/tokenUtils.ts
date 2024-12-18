import { cookies } from 'next/headers'

// Async function to get the Supabase token from cookies
export async function getSupabaseToken() {
  // Get the Supabase project URL from environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const projectId = supabaseUrl.split('.')[0].split('//')[1] // Extract project ID from URL

  // Build cookie names dynamically based on the project ID
  const tokenCookieName0 = `sb-${projectId}-auth-token.0`
  const tokenCookieName1 = `sb-${projectId}-auth-token.1`

  // Get cookies
  const cookieStore = await cookies() // Await the cookies store to get the actual cookie data

  // Check for the presence of either token0 or token1
  const token0 = cookieStore.get(tokenCookieName0)?.value
  const token1 = cookieStore.get(tokenCookieName1)?.value

  // Return the token if found
  return token0 || token1
}

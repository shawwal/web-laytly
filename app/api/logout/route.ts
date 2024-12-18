// app/api/logout/route.ts

import { getProjectId } from '@/utils/getProjectId';
import { NextResponse } from 'next/server';

export async function GET() {
 
  // Extract the project ID from the Supabase URL
  const projectId = getProjectId()
  // Define the cookie names based on the project ID
  const tokenCookieName0 = `sb-${projectId}-auth-token.0`;
  const tokenCookieName1 = `sb-${projectId}-auth-token.1`;

  // Create the response to delete the cookies
  const response = NextResponse.json({ message: 'Logged out successfully' });

  // Set cookies with max-age 0 to delete them, and ensure path is correct for all routes
  response.cookies.set(tokenCookieName0, '', { maxAge: 0, path: '/' });
  response.cookies.set(tokenCookieName1, '', { maxAge: 0, path: '/' });

  // Return the response indicating success
  return response;
}

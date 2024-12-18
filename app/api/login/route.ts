// app/api/login/route.ts (example server-side login API)

import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server'; // Assuming you're using Supabase

export async function POST(request: Request) {
  const { email, password } = await request.json();
  
  const supabase = await createClient();

  // Authenticate the user
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  
  if (error) {
    return NextResponse.json({ error: 'Login failed' }, { status: 400 });
  }

  // Revalidate the root path to update the layout
  revalidatePath('/');  // Trigger revalidation for the root layout

  // Return success response
  return NextResponse.json({ message: 'Login successful', data });
}

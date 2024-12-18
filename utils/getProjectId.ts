// utils/getProjectId.ts

export function getProjectId(): string {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const projectId = supabaseUrl.split('.')[0].split('//')[1] // Extract project ID from URL
    return projectId
  }
  
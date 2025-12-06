import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function WelcomePage() {
  const supabase = await createClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    // Not authenticated, redirect to login
    redirect('/login')
  }

  // If user is authenticated, redirect to dashboard
  redirect('/dashboard')
}


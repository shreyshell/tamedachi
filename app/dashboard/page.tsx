import { createClient } from '@/lib/supabase/server'
import { getPet } from '@/lib/services/pet'
import { redirect } from 'next/navigation'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const supabase = await createClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check if user has a pet
  const pet = await getPet(user.id)

  return <DashboardClient initialPet={pet} userEmail={user.email || ''} />
}

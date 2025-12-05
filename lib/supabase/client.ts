/**
 * Supabase Client Configuration for Tamedachi
 * 
 * This file provides Supabase client instances for different contexts:
 * - Browser client for client-side operations
 * - Server client for server-side operations with SSR support
 */

import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/lib/types/database'

/**
 * Creates a Supabase client for browser/client-side usage
 * This client is used in Client Components and browser contexts
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}


// Supabase client - disconnected for local development
// import { createClient } from '@supabase/supabase-js'
// import type { Database } from './types'

// const supabaseUrl = "https://uqxqksedyhsicgfufayo.supabase.co"
// const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxeHFrc2VkeWhzaWNnZnVmYXlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3OTg5ODcsImV4cCI6MjA2NzM3NDk4N30.UFc9HRMYNYioUjPxRD9PmTxI0-N9XXwcCcX1t1uHJFw"

// export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Mock Supabase client for local development
export const supabase = {
  auth: {
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    signUp: (credentials: any) => Promise.resolve({ data: { user: null }, error: null }),
    signInWithPassword: (credentials: any) => Promise.resolve({ data: { user: null }, error: null }),
    signOut: () => Promise.resolve({ error: null }),
    onAuthStateChange: (callback: any) => ({
      data: { subscription: { unsubscribe: () => {} } }
    })
  },
  from: (table: string) => ({
    select: () => ({ data: [], error: null }),
    insert: () => ({ data: null, error: null }),
    update: () => ({ data: null, error: null }),
    delete: () => ({ data: null, error: null })
  })
};

import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ifayyyjcbeumisvneiok.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmYXl5eWpjYmV1bWlzdm5laW9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0MjU0ODAsImV4cCI6MjA1MDAwMTQ4MH0.9gNMnnkgfA4ECVasxW_BzDwiSsvSdhGvAc-xFaE-J1s";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web'
    }
  }
});
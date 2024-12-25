import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ifayyyjcbeumisvneiok.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmYXl5eWpjYmV1bWlzdm5laW9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0MjU0ODAsImV4cCI6MjA1MDAwMTQ4MH0.9gNMnnkgfA4ECVasxW_BzDwiSsvSdhGvAc-xFaE-J1s';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
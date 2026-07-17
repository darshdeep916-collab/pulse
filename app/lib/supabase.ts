import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Fallback logic so the build won't crash when variables are being read statically
export const supabase = typeof window === 'undefined' && (!supabaseUrl || !supabaseAnonKey)
  ? ({} as any) 
  : createClient(supabaseUrl, supabaseAnonKey);






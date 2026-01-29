// Supabase configuration
import { createClient } from '@supabase/supabase-js';

// IMPORTANT: Replace with YOUR Supabase credentials
const SUPABASE_URL = 'https://zzvcaomhodxgtritcczp.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6dmNhb21ob2R4Z3RyaXRjY3pwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2Mzc2NzIsImV4cCI6MjA4NTIxMzY3Mn0.nqcR_3Gi1g6Hw7e5DC1vHvH5Hy6NXduHvP9xQAkQpns'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Helper function to get user role
export async function getUserRole() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  return data?.role;
}

// Helper function to check if user is moderator or admin
export async function isModeratorOrAdmin() {
  const role = await getUserRole();
  return role === 'moderator' || role === 'admin';
}
import { supabase } from '@/integrations/supabase/client';

export async function login(email: string) {
  const { error } = await supabase.auth.signInWithOtp({ email });
  if (error) throw error;
}

export async function logout() {
  await supabase.auth.signOut();
}

export async function getUser() {
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

export async function addNote(content: string) {
  const { error } = await supabase
    .from('notes')
    .insert([{ content, user_id: (await supabase.auth.getUser()).data.user?.id }]);
  if (error) throw error;
}

export async function listNotes() {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}
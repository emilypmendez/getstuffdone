import { supabase } from '../supabase';

// Example: Register a new user
export async function registerUser(email, password) {
  const { user, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return user;
}

// Example: Login user
export async function loginUser(email, password) {
  const { user, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return user;
}

// Fetch objectives
export async function fetchObjectives() {
  const { data, error } = await supabase.from('objectives').select('*');
  if (error) throw error;
  return data;
}

// Create a new objective
export async function createObjective(title, description) {
  const { data, error } = await supabase.from('objectives').insert([{ title, description }]);
  if (error) throw error;
  return data;
}

// Update an objective
export async function updateObjective(id, updates) {
  const { data, error } = await supabase.from('objectives').update(updates).eq('id', id);
  if (error) throw error;
  return data;
}

// Delete an objective
export async function deleteObjective(id) {
  const { error } = await supabase.from('objectives').delete().eq('id', id);
  if (error) throw error;
  return id;
}

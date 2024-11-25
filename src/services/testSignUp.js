import { supabase } from './supabaseClient'; // Ensure the path to supabaseClient.js is correct

async function createUser(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) {
    console.error('Error creating user:', error);
  } else {
    console.log('User created:', data);
  }
}

createUser('test@example.com', 'password'); // Replace with your test credentials

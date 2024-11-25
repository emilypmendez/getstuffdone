import { supabase } from '../supabase';

// Helper function to get the current user's ID
async function getUserId() {
  const { data: session, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) {
    console.error('Error fetching session:', sessionError);
    throw sessionError;
  }
  return session?.session?.user?.id; // Adjust this based on your session structure
}

// Example: Register a new user
export async function registerUser(email, password) {
  const { user, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return user;
}

// Example: Login user
export async function loginUser(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    console.log('Login response:', data);
    if (error) {
      console.error('Login error:', error);
      throw error;
    }
    return data.user; // Ensure the user is being returned correctly
  } catch (err) {
    console.error('Unexpected error during login:', err);
    throw err;
  }
}

// Fetch objectives
export async function fetchObjectives() {
  const { data, error } = await supabase
    .from('objectives')
    .select('id, title, description, user_id'); // Explicitly fetch fields
  if (error) throw error;
  return data;
}

// Create a new objective
export async function createObjective(title, description) {
  try {
    console.log('Creating objective with:', { title, description }); // Debug log
    const userId = await getUserId();
    if (!userId) {
      throw new Error('User is not logged in.');
    }

    const { data, error } = await supabase
      .from('objectives')
      .insert([
        { title, description, user_id: userId }
      ])
      .select('*'); // Explicitly return the inserted rows
      console.log('Supabase response:', { data, error });

    if (error) {
      console.error('Error creating objective:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      throw new Error('Objective insertion failed: No data returned.');
    }

    console.log('Objective created:', data[0]); // Log only the first inserted row
    return data[0];
  } catch (err) {
    console.error('Unexpected error in createObjective:', err);
    throw err;
  }
}


// Update an objective
export async function updateObjective(id, updates) {
  console.log('Updating objective with ID:', id); // Debug log
  console.log('Updates:', updates); // Debug log

  const userId = await getUserId();
  
  if (!userId) {
    throw new Error('User is not logged in.');
  }
  
  const { data, error } = await supabase
    .from('objectives')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId) // Ensure the update is scoped to the current user
    .select('*'); // Return updated rows

  if (error) {
    console.error('Error updating objective:', error);
    throw error;
  }

  if (!data || data.length === 0) {
    throw new Error('Update failed: Objective not found or insufficient permissions.');
  }  

  return data[0]; // Return the updated objective
}

// Delete an objective
export async function deleteObjective(id) {
  console.log('Deleting objective with ID:', id); // Debug log

  const { data, error } = await supabase
    .from('objectives')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting objective:', error);
    throw error;
  }

  console.log('Deleted objective:', data); // Debug log
  return data;
}

export async function logoutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error logging out:', error.message);
    throw error;
  }
  console.log('User logged out successfully');
}
// src/services/AuthProvider.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data: session } = await supabase.auth.getSession();
      setUser(session?.user || null); // Update user based on session
    };

    checkSession();

    // Listen for auth state changes
    const { subscription } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    // Ensure cleanup by unsubscribing
    return () => {
      if (subscription && typeof subscription.unsubscribe === 'function') {
        subscription.unsubscribe();
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};

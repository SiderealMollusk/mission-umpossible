// src/authProvider.ts
import { AuthProvider } from 'react-admin';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase URL or Anon Key in environment variables');
}
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const authProvider: AuthProvider = {
    login: async ({ username, password }) => {
        // React-Admin passes `username`, but Supabase prototype (4/29/2025) expects `email`
        const email = username;
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            console.error('Login failed:', error.message);
            throw new Error(error.message);
        }
        console.log('Login successful for:', email);
    },
    logout: async () => {
        await supabase.auth.signOut();
        console.log('User logged out');
    },
    checkAuth: async () => {
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
            console.warn('No session found during checkAuth');
            throw new Error('Not authenticated');
        }
    },
    checkError: async () => Promise.resolve(),
    getPermissions: async () => Promise.resolve(),
    getIdentity: async () => {
        const { data, error } = await supabase.auth.getUser();
        if (error || !data.user) {
            console.warn('Failed to get identity');
            throw new Error('Not authenticated');
        }
        return {
            id: data.user.id,
            fullName: data.user.email || '',
        };
    },
};

export default authProvider;
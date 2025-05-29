import { supabaseDataProvider } from 'ra-supabase';

export const dataProvider = supabaseDataProvider({
  instanceUrl: import.meta.env.VITE_SUPABASE_URL!,
  apiKey: import.meta.env.VITE_SUPABASE_ANON_KEY!,
  schema: () => 'public',
});
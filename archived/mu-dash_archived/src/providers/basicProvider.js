// src/providers/basicProvider.js
import { supabaseDataProvider } from 'ra-supabase';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const dataProvider = supabaseDataProvider({
  supabaseUrl,
  supabaseKey,
});
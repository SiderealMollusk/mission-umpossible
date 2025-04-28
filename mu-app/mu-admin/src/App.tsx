// src/App.tsx
import { Admin, Resource } from 'react-admin';
import { supabaseDataProvider } from 'ra-supabase';
import authProvider from './authProvider';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

const dataProvider = supabaseDataProvider({
  instanceUrl: supabaseUrl,
  apiKey: supabaseAnonKey,
  supabaseClient,
});

function App() {
  return (
    <Admin 
      dataProvider={dataProvider} 
      authProvider={authProvider}
    >
      <Resource name="characters" />
    </Admin>
  );
}

export default App;
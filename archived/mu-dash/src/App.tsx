import { Admin, Resource } from "react-admin";
import { supabaseDataProvider } from "ra-supabase-core"; // Or whatever you're using
import { Layout } from "./Layout";

import { UserList } from "./users/UserList";
import { CharacterList } from "./characters/CharacterList";

const VITE_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const VITE_SUPABASE_API_KEY = import.meta.env.VITE_SUPABASE_API_KEY;

const dataProvider = supabaseDataProvider({
  instanceUrl: VITE_SUPABASE_URL,
  apiKey: VITE_SUPABASE_API_KEY,
});

export const App = () => (
  <Admin dataProvider={dataProvider} layout={Layout}>
    <Resource name="users" list={UserList} />
    <Resource name="characters" list={CharacterList} />
    {/* Add more <Resource> as needed */}
  </Admin>
);
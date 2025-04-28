// src/App.tsx
import { Admin, Resource } from 'react-admin';
import { dataProvider } from './supabaseDataProvider';
import authProvider from './authProvider';
import { CharacterList } from './characters/CharacterList';
import { CharacterShow } from './characters/CharacterShow';
import { CharacterEdit } from './characters/CharacterEdit';

function App() {
  return (
    <Admin 
      dataProvider={dataProvider} 
      authProvider={authProvider}
    >
      <Resource
        name="characters"
        list={CharacterList}
        show={CharacterShow}
        edit={CharacterEdit}
      />
    </Admin>
  );
}

export default App;
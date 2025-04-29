// src/App.tsx
import { log } from './util/logger';
import { Admin, Resource } from 'react-admin';
import { dataProvider } from './supabaseDataProvider';
import authProvider from './authProvider';
import { CharacterList } from './characters/CharacterList';
import { CharacterShow } from './characters/CharacterShow';
import { CharacterEdit } from './characters/CharacterEdit';
import { LogList } from './log_components/LogList';

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
      <Resource 
        name="logs"
        list={LogList}
      />
    </Admin>
    
  );
}

export default App;
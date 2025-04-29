import { Admin, Resource, CustomRoutes } from 'react-admin';
import { Route } from 'react-router-dom';
import { dataProvider } from './supabaseDataProvider';
import authProvider from './authProvider';
import { CharacterList } from './characters/CharacterList';
import { CharacterShow } from './characters/CharacterShow';
import { CharacterEdit } from './characters/CharacterEdit';
import { LogList } from './log_components/LogList';
import { Layout } from './Layout'; // Important: Layout must wire the CustomMenu inside it
import ActivityAssignmentPage from './pages/ActivityAssignmentPage';
import ComponentTestingPage from './pages/ComponentTesting';

function App() {
  return (
    <Admin 
      dataProvider={dataProvider} 
      authProvider={authProvider}
      layout={Layout}
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
      <CustomRoutes>
        <Route path="/activity-assignment" element={<ActivityAssignmentPage />} />
        <Route path="/component-testing" element={<ComponentTestingPage />} />
      </CustomRoutes>
    </Admin>
  );
}

export default App;
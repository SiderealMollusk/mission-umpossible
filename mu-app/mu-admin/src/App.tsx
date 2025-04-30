import { Admin, Resource, CustomRoutes } from 'react-admin';
import { Route } from 'react-router-dom';
import { dataProvider } from './supabaseDataProvider';
import authProvider from './authProvider';
import { CharacterList } from './characters/CharacterList';
import { CharacterShow } from './characters/CharacterShow';
import { CharacterEdit } from './characters/CharacterEdit';
import { LogList } from './log_components/LogList';
import { Layout } from './Layout'; // Important: Layout must wire the CustomMenu inside it
import ActivityAssignmentPage from './pages/ActivityAssignment';
import ComponentTestingPage from './pages/ComponentTesting';
import ActivityDetailView from './activities/ActivityDetailView';


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
        <Route path="/activity-detail-view-selectable" element={<ActivityDetailView record={{ id: '1', title: 'Selectable Activity', description: 'Selectable view description.', date: new Date().toISOString() }} onSelect={() => {}} selectorIsHeader={true} activities={[]} />} />
        <Route path="/activity-detail-view-readonly" element={<ActivityDetailView record={{ id: '1', title: 'Readonly Activity', description: 'Readonly view description.', date: new Date().toISOString() }} />} />
      </CustomRoutes>
    </Admin>
  );
}

export default App;
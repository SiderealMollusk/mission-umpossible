// src/pages/Dashboard.js
import { Admin, Resource, ListGuesser } from 'react-admin';
import { dataProvider } from '../providers/basicProvider';

const Dashboard = () => {
  return (
    <Admin basename="/dashboard" dataProvider={dataProvider}>
      <Resource name="characters" list={ListGuesser} />
      <Resource name="users" list={ListGuesser} />
    </Admin>
  );
};

export default Dashboard;
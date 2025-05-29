import { Admin, Resource } from "react-admin";
import { Layout } from "./Layout";
import { dataProvider } from "./infra/dataProvider";

export const App = () => (
  <Admin layout={Layout} dataProvider={dataProvider}>
    <Resource name="test_table" />
  </Admin>
);

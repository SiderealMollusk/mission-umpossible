import { List, Datagrid, TextField } from "react-admin";

export const UserList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="email" />
      <TextField source="created_at" />
      {/* Add any more fields you want */}
    </Datagrid>
  </List>
);
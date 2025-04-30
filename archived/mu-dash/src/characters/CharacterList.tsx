

import { List, Datagrid, TextField } from "react-admin";

export const CharacterList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="created_at" />
    </Datagrid>
  </List>
);
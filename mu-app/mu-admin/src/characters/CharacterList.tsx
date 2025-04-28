import { List, Datagrid, TextField } from 'react-admin';

export function CharacterList() {
  return (
    <List>
      <Datagrid rowClick="show">
        <TextField source="name" />
        <TextField source="species" />
        <TextField source="backstory" />
        <TextField source="rp_notes" />
        <TextField source="owner_id" />
        <TextField source="id" />
      </Datagrid>
    </List>
  );
}
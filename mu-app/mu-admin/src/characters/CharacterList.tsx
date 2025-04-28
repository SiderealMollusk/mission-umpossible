import { List, Datagrid, TextField, BooleanField } from 'react-admin';

export function CharacterList() {
  return (
    <List>
      <Datagrid rowClick="show">
        <TextField source="name" />
        <TextField source="species" />
        <BooleanField source="active" />
        <TextField source="backstory" />
        <TextField source="rp_notes" />
        <TextField source="owner_id" />
        <TextField source="id" />
      </Datagrid>
    </List>
  );
}
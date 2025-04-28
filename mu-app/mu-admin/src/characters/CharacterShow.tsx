

import { Show, SimpleShowLayout, TextField, BooleanField } from 'react-admin';

export function CharacterShow() {
  return (
    <Show>
      <SimpleShowLayout>
        <TextField source="id" />
        <TextField source="name" />
        <TextField source="species" />
        <TextField source="backstory" />
        <TextField source="rp_notes" />
        <BooleanField source="active" />
      </SimpleShowLayout>
    </Show>
  );
}
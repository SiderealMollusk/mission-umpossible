import { Edit, SimpleForm, TextInput, BooleanInput } from 'react-admin';

export function CharacterEdit() {
  return (
    <Edit>
      <SimpleForm>
        <TextInput source="id" disabled />
        <TextInput source="name" />
        <TextInput source="species" />
        <TextInput source="backstory" multiline fullWidth />
        <TextInput source="rp_notes" multiline fullWidth />
        <TextInput source="image_url" label="Image URL" fullWidth />
      </SimpleForm>
    </Edit>
  );
}

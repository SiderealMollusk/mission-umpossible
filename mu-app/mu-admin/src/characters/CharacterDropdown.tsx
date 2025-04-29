import { useEffect, useState } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { supabase } from '../supabase';

type Character = {
  id: string;
  name: string;
};

type Props = {
  value: string | null;
  onChange: (id: string) => void;
};

export default function CharacterDropdown({ value, onChange }: Props) {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCharacters = async () => {
      const { data, error } = await supabase
        .from('characters')
        .select('id, name')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error loading characters:', error);
      } else {
        setCharacters(data ?? []);
      }

      setLoading(false);
    };

    fetchCharacters();
  }, []);

  if (loading) {
    return <CircularProgress size={24} />;
  }

  return (
    <FormControl fullWidth>
      <InputLabel id="character-dropdown-label">Character</InputLabel>
      <Select
        labelId="character-dropdown-label"
        value={value ?? ''}
        onChange={(e) => {
          const selectedId = e.target.value as string;
          onChange(selectedId);
        }}
        label="Character"
      >
        {characters.map((char) => (
          <MenuItem key={char.id} value={char.id}>
            {char.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
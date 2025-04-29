import { useState } from 'react';
import {
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
} from '@mui/material';
import { useNotify } from 'react-admin';
import { supabase } from '../supabase';

export interface RowSelectorProps {
  resourceName: string;
  mapOption: (row: any) => string;
  onSelect: (row: any) => void;
  placeholder?: string;
}

export function RowSelector({
  resourceName,
  mapOption,
  onSelect,
  placeholder,
}: RowSelectorProps) {
  const notify = useNotify();
  const [options, setOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  const effectivePlaceholder = placeholder || `Select ${resourceName}`;

  const fetchOptions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from(resourceName).select('*');
      if (error) {
        console.error('Error fetching options:', error);
        notify('Error fetching options', { type: 'error' });
        return;
      }
      setOptions(data || []);
    } catch (err) {
      console.error('Unexpected error fetching options:', err);
      notify('Unexpected error', { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    fetchOptions();
  };

  const handleChange = (event: any) => {
    const selectedId = event.target.value;
    const selectedRow = options.find((row) => row.id === selectedId);
    setSelected(selectedRow);
    onSelect(selectedRow);
  };

  return (
    <FormControl fullWidth>
      <InputLabel>{effectivePlaceholder}</InputLabel>
      <Select
        value={selected?.id || ''}
        label={effectivePlaceholder}
        onOpen={handleOpen}
        onChange={handleChange}
        renderValue={() =>
          selected ? mapOption(selected) : effectivePlaceholder
        }
      >
        {loading ? (
          <MenuItem disabled>
            <CircularProgress size={20} />
          </MenuItem>
        ) : (
          options.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {mapOption(option)}
            </MenuItem>
          ))
        )}
      </Select>
    </FormControl>
  );
}
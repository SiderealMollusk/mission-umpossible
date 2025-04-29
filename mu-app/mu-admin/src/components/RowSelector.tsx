import { useState } from 'react';
import {
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Tooltip,
  Typography,
} from '@mui/material';
import { useNotify } from 'react-admin';
import { supabase } from '../supabase';

export interface RowSelectorProps {
  resourceName: string;
  mapOption: (row: any) => string;
  onSelect: (row: any) => void;
  placeholder?: string;
  selectorIsHeader?: boolean;
  record?: any;
}

export function RowSelector({
  resourceName,
  mapOption,
  onSelect,
  placeholder,
  selectorIsHeader,
  record,
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

  // If a fixed record is provided, render as read-only label with optional tooltip
  if (record) {
    return (
      <Tooltip title={mapOption(record)}>
        <Typography
          variant={selectorIsHeader ? 'body2' : 'body1'}
          sx={{
            backgroundColor: selectorIsHeader ? 'transparent' : 'background.paper',
            fontSize: selectorIsHeader ? '0.875rem' : 'inherit',
            height: selectorIsHeader ? 36 : 'auto',
            padding: selectorIsHeader ? '6px 8px' : 'inherit',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            cursor: 'default',
          }}
        >
          {mapOption(record)}
        </Typography>
      </Tooltip>
    );
  }

  // Otherwise, render the interactive selector dropdown
  return (
    <FormControl fullWidth variant={selectorIsHeader ? "standard" : "outlined"}>
      {!selectorIsHeader && <InputLabel>{effectivePlaceholder}</InputLabel>}
      <Select
        value={selected?.id || ''}
        label={effectivePlaceholder}
        onOpen={handleOpen}
        onChange={handleChange}
        size={selectorIsHeader ? "small" : "medium"}
        renderValue={() =>
          selected ? mapOption(selected) : effectivePlaceholder
        }
        sx={selectorIsHeader ? { backgroundColor: 'transparent', fontSize: '0.875rem', height: 36 } : {}}
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
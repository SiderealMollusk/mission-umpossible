import { Typography, Box, Divider } from '@mui/material';
import { RowDetailView } from '../components/RowDetailView';

interface Character {
  id: string;
  name: string;
  species?: string;
  backstory?: string;
  created_at?: string;
}

interface CharacterDetailViewProps {
  record: Character;
  onSelect: (character: Character) => void;
}

export function CharacterDetailView({ record, onSelect }: CharacterDetailViewProps) {
  return (
    <RowDetailView
      record={record}
      labelFromRecord={(r) => r.name}
      tooltipFromRecord={(r) =>
        `ID: ${r.id}\nCreated: ${new Date(r.created_at || '').toLocaleString()}`
      }
      resourceName="characters"
      onSelect={onSelect}
      selectorIsHeader={true}
    >
      {record && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1">Species:</Typography>
          <Typography>{record.species || 'Unknown'}</Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1">Backstory:</Typography>
          <Typography whiteSpace="pre-line">
            {record.backstory || 'No backstory provided.'}
          </Typography>
        </Box>
      )}
    </RowDetailView>
  );
}

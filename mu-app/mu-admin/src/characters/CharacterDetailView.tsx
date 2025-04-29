import { Typography, Box, Divider } from '@mui/material';
import { RowDetailView } from '../components/RowDetailView';
import { RowSelector } from '../components/RowSelector';

interface Character {
  id: string;
  name: string;
  species?: string;
  backstory?: string;
  created_at?: string;
}

interface CharacterDetailViewProps {
  record: Character;
}

export function CharacterDetailView({ record }: CharacterDetailViewProps) {
  return (
    <RowDetailView
      record={record}
      labelFromRecord={(r) => r.name}
      tooltipFromRecord={(r) =>
        `ID: ${r.id}\nCreated: ${new Date(r.created_at || '').toLocaleString()}`
      }
      selector={
        <RowSelector
          resourceName="characters"
          mapOption={(row: Character) => row.name || row.id}
          selectorIsHeader
          onSelect={() => {}}
        />
      }
      selectorIsHeader={true}
    >
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle1">Species:</Typography>
        <Typography>{record.species || 'Unknown'}</Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1">Backstory:</Typography>
        <Typography whiteSpace="pre-line">
          {record.backstory || 'No backstory provided.'}
        </Typography>
      </Box>
    </RowDetailView>
  );
}

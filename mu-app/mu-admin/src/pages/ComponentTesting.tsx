import { useState } from 'react';
import { Card, CardContent, Typography, Box, Divider } from '@mui/material';
import { CharacterDetailView } from '../characters/CharacterDetailView';

const mockCharacters = [
  {
    id: 'char-001',
    name: 'Test Character',
    species: 'Synthetic',
    backstory: 'Created as a test subject for UI evaluation.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'char-002',
    name: 'Backup Clone',
    species: 'Human',
    backstory: '',
    created_at: new Date().toISOString(),
  },
  {
    id: 'char-003',
    name: 'Nullface',
    species: '',
    backstory: '',
    created_at: new Date().toISOString(),
  },
];

const ComponentTesting = () => {
  const [selectedCharacter, setSelectedCharacter] = useState<any>(mockCharacters[0]);

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Component Testing
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 2 }}>
          This page is used to test and develop components in isolation.
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1" gutterBottom>
          Character Detail View - Basic
        </Typography>
        <Box sx={{ mb: 4 }}>
          <CharacterDetailView
            record={selectedCharacter}
            onSelect={(c: any) => setSelectedCharacter(c)}
          />
        </Box>

        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1" gutterBottom>
          Character Detail View - No Species or Backstory
        </Typography>
        <Box sx={{ mb: 4 }}>
          <CharacterDetailView
            record={{ ...mockCharacters[0], species: '', backstory: '' }}
            onSelect={(c: any) => setSelectedCharacter(c)}
          />
        </Box>

        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1" gutterBottom>
          Character Detail View - Selector Enabled
        </Typography>
        <Box sx={{ mb: 4 }}>
          <CharacterDetailView
            record={selectedCharacter}
            onSelect={(c: any) => setSelectedCharacter(c)}
            selectorIsHeader={true}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default ComponentTesting;
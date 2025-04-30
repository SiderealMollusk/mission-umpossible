import { useState } from 'react';
import { Card, CardContent, Typography, Box, Divider } from '@mui/material';
import Grid from '@mui/material/Grid';
import { CharacterDetailView } from '../characters/CharacterDetailView';
import { ActivityDetailView } from '../activities/ActivityDetailView';

const ComponentTestingPage = () => {
  const [selectedCharacter, setSelectedCharacter] = useState<any>(null);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);

  const mockCharacter = {
    id: 'char_001',
    name: 'Test Character',
    species: 'Human',
    backstory: 'Once upon a time...',
    created_at: new Date().toISOString(),
  };

  const mockActivity = {
    id: 'act_001',
    name: 'Test Activity',
    description: 'This is a test activity',
    created_at: new Date().toISOString(),
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Component Testing
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2} alignItems="stretch">
          <Grid item xs={6}>
            <CharacterDetailView record={mockCharacter} onSelect={() => {}} />
          </Grid>
          <Grid item xs={6}>
            <CharacterDetailView
              record={selectedCharacter}
              onSelect={setSelectedCharacter}
            />
          </Grid>
          <Grid item xs={6}>
            <ActivityDetailView record={mockActivity} onSelect={() => {}} />
          </Grid>
          <Grid item xs={6}>
            <ActivityDetailView
              record={selectedActivity}
              onSelect={setSelectedActivity}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />
      </CardContent>
    </Card>
  );
};

export default ComponentTestingPage;
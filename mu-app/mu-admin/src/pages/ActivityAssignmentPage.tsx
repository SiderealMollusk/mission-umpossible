import { useState } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import { RowSelector } from '../components/RowSelector';
import { CharacterDetailView } from '../characters/CharacterDetailView';
import { ActivityDetailView } from '../activities/ActivityDetailView';

const ActivityAssignmentPage = () => {
  const [selectedCharacter, setSelectedCharacter] = useState<any>(null);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Activity Assignment
        </Typography>
        <Grid container spacing={2} alignItems="stretch">
          <Grid item xs={6}>
            <Box display="flex" flexDirection="column" height="100%">
              <RowSelector
                resourceName="characters"
                mapOption={(row: any) => row.name || row.id}
                onSelect={(row: any) => setSelectedCharacter(row)}
              />
              {selectedCharacter && (
                <CharacterDetailView record={selectedCharacter} />
              )}
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box display="flex" flexDirection="column" height="100%">
              <RowSelector
                resourceName="activities"
                mapOption={(row: any) => row.name || row.id}
                onSelect={(row: any) => setSelectedActivity(row)}
              />
              {selectedActivity && (
                <ActivityDetailView record={selectedActivity} />
              )}
            </Box>
          </Grid>
        </Grid>
        <Typography variant="body1" sx={{ marginTop: 2 }}>
          This is a stub page for assigning activities to players or characters. More functionality coming soon.
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ActivityAssignmentPage;
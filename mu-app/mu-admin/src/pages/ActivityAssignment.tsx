import { useState } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import Grid from '@mui/material/Grid';
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
        <Box sx={{ my: 4 }}>
          <hr />
          <Typography variant="h6" gutterBottom>
            Step 1: Select Character and Activity
          </Typography>
        </Box>
        <Grid container spacing={2} alignItems="stretch">
          <Grid item xs={6}>
            <Box display="flex" flexDirection="column" height="100%">
              <CharacterDetailView
                record={selectedCharacter ?? {}}
                onSelect={(character: any) => setSelectedCharacter(character)}
              />
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box display="flex" flexDirection="column" height="100%">
              <ActivityDetailView
                record={selectedActivity ?? {}}
                onSelect={(activity: any) => setSelectedActivity(activity)}
              />
            </Box>
          </Grid>
        </Grid>
        <Box sx={{ my: 4 }}>
          <hr />
          <Typography variant="h6" gutterBottom>
            Step 2: Review Current State
          </Typography>

          {!selectedCharacter ? (
            <Typography variant="body1" sx={{ mt: 2 }}>
              Select a character to view their current activity.
            </Typography>
          ) : (
            <Typography variant="h6" sx={{ mt: 2 }}>
              Step 2: {selectedCharacter.name}'s Activity
            </Typography>
          )}
        </Box>
        <Typography variant="body1" sx={{ marginTop: 2 }}>
          This is a stub page for assigning activities to players or characters. More functionality coming soon.
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ActivityAssignmentPage;
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
        <Grid container spacing={2} alignItems="stretch">
          <Grid item xs={6}>
            <Box display="flex" flexDirection="column" height="100%">
              <CharacterDetailView
                record={selectedCharacter}
                onSelect={(character: any) => setSelectedCharacter(character)}
              />
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box display="flex" flexDirection="column" height="100%">
              {selectedActivity && (
                <ActivityDetailView
                  record={selectedActivity}
                  onSelect={(activity: any) => setSelectedActivity(activity)}
                />
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
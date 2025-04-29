import { useState } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { RowSelector } from '../components/RowSelector';

const ActivityAssignmentPage = () => {
  const [selectedCharacter, setSelectedCharacter] = useState<any>(null);

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Activity Assignment
        </Typography>
        <RowSelector
          resourceName="characters"
          mapOption={(row: any) => row.name || row.id}
          onSelect={(row: any) => setSelectedCharacter(row)}
        />
        {selectedCharacter && (
          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Selected: {selectedCharacter.name || selectedCharacter.id}
          </Typography>
        )}
        <Typography variant="body1" sx={{ marginTop: 2 }}>
          This is a stub page for assigning activities to players or characters. More functionality coming soon.
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ActivityAssignmentPage;
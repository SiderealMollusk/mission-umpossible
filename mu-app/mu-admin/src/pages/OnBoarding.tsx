import { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Divider, List, ListItem, ListItemText, Checkbox, Button } from '@mui/material';
import { supabase } from '../supabase' // adjust path if necessary

const OnBoarding = () => {
  const [characters, setCharacters] = useState<any[]>([]);
  const [selectedCharacterIds, setSelectedCharacterIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchCharacters = async () => {
      const { data, error } = await supabase
        .from('characters_onboardable')
        .select('*');
  
      if (error) {
        console.error("Error fetching onboardable characters:", error);
        return;
      }
  
      console.log("Onboardable characters:", data);
      setCharacters(data);
    };
  
    fetchCharacters();
  }, []);

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Welcome to Mission Umpossible
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="body1">
          This onboarding experience will guide you through character selection,
          initial mission alignment, and communication setup.
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" gutterBottom>
          Available Characters (Humans with no activity states)
        </Typography>
        <List dense>
          {characters.map((char) => (
            <ListItem key={char.character_id}>
              <Checkbox
                checked={selectedCharacterIds.includes(char.character_id)}
                onChange={(e) => {
                  setSelectedCharacterIds((prev) =>
                    e.target.checked
                      ? [...prev, char.character_id]
                      : prev.filter((id) => id !== char.character_id)
                  );
                }}
              />
              <ListItemText
                primary={char.name}
                secondary={
                  char.transports?.length ? char.transports.join(', ') : 'No transports'
                }
              />
            </ListItem>
          ))}
        </List>
        <Button
          variant="contained"
          color="primary"
          disabled={selectedCharacterIds.length === 0}
          sx={{ mt: 2 }}
          onClick={async () => {
            try {
              const response = await fetch('http://localhost:5176/api/v1/onboard', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ character_ids: selectedCharacterIds }),
              });

              if (!response.ok) {
                throw new Error(`Failed to onboard: ${response.statusText}`);
              }

              const result = await response.json();
              console.log("Onboard success:", result);
            } catch (err) {
              console.error("Onboard failed:", err);
            }
          }}
        >
          On Board
        </Button>
      </CardContent>
    </Card>
  );
};

export default OnBoarding;
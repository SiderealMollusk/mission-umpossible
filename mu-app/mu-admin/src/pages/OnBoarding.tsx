import { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Divider, List, ListItem, ListItemText, Checkbox, Button, TextField, Stack } from '@mui/material';
import { supabase } from '../supabase' // adjust path if necessary

const OnBoarding = () => {
  const [characters, setCharacters] = useState<any[]>([]);
  const [selectedCharacterIds, setSelectedCharacterIds] = useState<string[]>([]);
  const [playerDisplayName, setPlayerDisplayName] = useState('');
  const [characterName, setCharacterName] = useState('');
  const [playerPhone, setPlayerPhone] = useState('+1');

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
          Player Contact Info
        </Typography>
        <Stack spacing={2} direction="column">
          <TextField
            label="Player Display Name"
            value={playerDisplayName}
            onChange={(e) => setPlayerDisplayName(e.target.value)}
          />
          <TextField
            label="Character Name"
            value={characterName}
            onChange={(e) => setCharacterName(e.target.value)}
          />
          <TextField
            label="Phone Number"
            value={playerPhone}
            onChange={(e) => setPlayerPhone(e.target.value)}
            helperText="Starts with +1 for US numbers — include country code if different."
          />
          <Button
            variant="outlined"
            onClick={async () => {
              try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/players/seed`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    display_name: playerDisplayName,
                    character_name: characterName,
                    phone_number: playerPhone,
                  }),
                });

                if (!response.ok) {
                  throw new Error(`Failed to create player: ${response.statusText}`);
                }

                const result = await response.json();
                console.log("Player bundle created:", result);
              } catch (error) {
                console.error("Error submitting player info:", error);
              }
            }}
          >
            Save Info
          </Button>
        </Stack>
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
              const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/onboard`, {
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
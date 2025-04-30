import { useState } from "react";
import { Card, CardContent, Typography, Box, Divider, Button } from "@mui/material";
import { CharacterDetailView } from "../characters/CharacterDetailView";

const ActivityAssignmentPage = () => {
  const [steps, setSteps] = useState([false, false, false, false]);
  const [selectedCharacter, setSelectedCharacter] = useState<any>(null);

  const handleToggle = (index: number) => {
    const newSteps = [...steps];
    newSteps[index] = !newSteps[index];
    // Invalidate all subsequent steps if the current is being uncompleted
    for (let i = index + 1; i < newSteps.length; i++) {
      newSteps[i] = false;
    }
    setSteps(newSteps);
  };

  return (
    <Card>
      <CardContent>
        <Step
          number={1}
          label="Select a character"
          ready={true}
          complete={!!selectedCharacter}
          toggleComplete={() => {}}
          contentReady={
            <div>
              aaaaaaa
              <CharacterDetailView
              record={selectedCharacter}
              onSelect={setSelectedCharacter}
              />
              bbbbbb
            </div>
          }
        />
        <Divider sx={{ my: 3 }} />

        <Step
          number={2}
          label="Step 2"
          ready={steps[0]}
          complete={steps[1]}
          toggleComplete={() => handleToggle(1)}
        />
        <Divider sx={{ my: 3 }} />

        <Step
          number={3}
          label="Step 3"
          ready={steps[1]}
          complete={steps[2]}
          toggleComplete={() => handleToggle(2)}
        />
        <Divider sx={{ my: 3 }} />

        <Step
          number={4}
          label="Step 4"
          ready={steps[2]}
          complete={steps[3]}
          toggleComplete={() => handleToggle(3)}
        />
      </CardContent>
    </Card>
  );
};

interface StepProps {
  number: number;
  label: string;
  ready: boolean;
  complete: boolean;
  toggleComplete: () => void;
  contentReady?: React.ReactNode;
  contentWaiting?: React.ReactNode;
}

const Step = ({ label, ready, complete, toggleComplete, contentReady, contentWaiting }: StepProps) => {
  return (
    <Box>
      <Typography variant="h6">{label}</Typography>
      <Typography color="text.secondary">
        {ready ? "Ready" : "Waiting on previous step..."}
      </Typography>
      <Box mt={1}>
        {ready ? (
          <>
            {contentReady}
            <Button
              variant={complete ? "contained" : "outlined"}
              color={complete ? "success" : "primary"}
              onClick={toggleComplete}
            >
              {complete ? "Complete" : "Mark as Complete"}
            </Button>
          </>
        ) : (
          contentWaiting
        )}
      </Box>
    </Box>
  );
};

export default ActivityAssignmentPage;

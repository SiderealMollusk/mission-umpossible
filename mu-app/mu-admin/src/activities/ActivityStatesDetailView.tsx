

import { Typography, Box, Divider } from '@mui/material';
import { RowDetailView } from '../components/RowDetailView';

interface ActivityState {
  id: string;
  activity_id: string;
  character_id: string;
  state: Record<string, any>;
  created_at?: string;
}

interface ActivityStatesDetailViewProps {
  record: ActivityState;
  onSelect: (state: ActivityState) => void;
}

export function ActivityStatesDetailView({ record, onSelect }: ActivityStatesDetailViewProps) {
  if (!record) return null;

  return (
    <RowDetailView
      record={record}
      labelFromRecord={(r) => `State for Activity ${r.activity_id}`}
      tooltipFromRecord={(r) =>
        `ID: ${r.id}\nCharacter: ${r.character_id}\nCreated: ${new Date(r.created_at || '').toLocaleString()}`
      }
      resourceName="activity_states"
      onSelect={onSelect}
      selectorIsHeader={true}
    >
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle1">State Payload:</Typography>
        <Typography whiteSpace="pre-line">
          {JSON.stringify(record.state, null, 2)}
        </Typography>
      </Box>
    </RowDetailView>
  );
}
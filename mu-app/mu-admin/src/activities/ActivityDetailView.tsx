import { Typography, Box, Divider } from '@mui/material';
import { RowDetailView } from '../components/RowDetailView';

interface Activity {
  id: string;
  name?: string;
  description?: string;
  created_at?: string;
}

interface ActivityDetailViewProps {
  record: Activity;
  onSelect: (activity: Activity) => void;
}

export function ActivityDetailView({ record, onSelect }: ActivityDetailViewProps) {
  return (
    <RowDetailView
      record={record}
      labelFromRecord={(r) => r.name || r.id}
      tooltipFromRecord={(r) =>
        `ID: ${r.id}\nCreated: ${new Date(r.created_at || '').toLocaleString()}`
      }
      resourceName="activities"
      onSelect={onSelect}
      selectorIsHeader={true}
    >
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle1">Description:</Typography>
        <Typography whiteSpace="pre-line">
          {record.description || 'No description available.'}
        </Typography>
      </Box>
    </RowDetailView>
  );
}

import { Typography, Box, Divider } from '@mui/material';
import { RowDetailView } from '../components/RowDetailView';

interface Activity {
  id: string;
  name?: string;
  description?: string;
  created_at?: string;
  spec?: any;
}

interface ActivityDetailViewProps {
  record: Activity;
  onSelect?: (activity: Activity) => void;
}

export function ActivityDetailView({ record, onSelect }: ActivityDetailViewProps) {
  if (!record) return null;

  return (
    <RowDetailView
      record={record}
      labelFromRecord={(r) => r.name || r.id}
      tooltipFromRecord={(r) => `ID: ${r.id}\nCreated: ${new Date(r.created_at || '').toLocaleString()}`}
      resourceName="activities"
      onSelect={onSelect}
      selectorIsHeader={!!onSelect}
    >
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle1">Description:</Typography>
        <Typography whiteSpace="pre-line">
          {record.description || 'No description available.'}
        </Typography>

        <Divider sx={{ my: 2 }} />

        {record.spec && (
          <>
            <Typography variant="subtitle1">Spec (JSON):</Typography>
            <Typography
              variant="body2"
              component="pre"
              sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}
            >
              {JSON.stringify(record.spec, null, 2)}
            </Typography>
          </>
        )}
      </Box>
    </RowDetailView>
  );
}

export default ActivityDetailView;

/**
 * ActivityDetailView
 *
 * Usage:
 * - This is a wrapper around RowDetailView specialized for Activity records.
 * - Use `record` to pass the selected activity object.
 * - If selectorIsHeader is true, dropdown selection is shown.
 * - Provide `onSelect` for changing the selected activity if interactive.
 */

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
  if (!record) return null;

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

export default ActivityDetailView;

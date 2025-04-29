import { Card, CardContent, Typography, Tooltip, Box } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

interface ActivityDetailViewProps {
  record: any;
}

export function ActivityDetailView({ record }: ActivityDetailViewProps) {
  if (!record) {
    return (
      <Card sx={{ minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CardContent>
          <Typography variant="body2" color="textSecondary">
            No activity selected.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ minHeight: 300 }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">{record.name || record.id}</Typography>
          <Tooltip title={`ID: ${record.id}\nCreated: ${record.created_at || 'Unknown'}`}>
            <InfoOutlinedIcon fontSize="small" color="action" sx={{ ml: 1 }} />
          </Tooltip>
        </Box>
        <Typography variant="body2" sx={{ marginTop: 2 }}>
          {record.description || 'No description available.'}
        </Typography>
      </CardContent>
    </Card>
  );
}

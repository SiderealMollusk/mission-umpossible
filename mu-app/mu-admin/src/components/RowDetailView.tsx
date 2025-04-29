import { Card, CardContent, Typography, Box, Tooltip, IconButton } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { ReactNode } from 'react';

interface RowDetailViewProps<T> {
  record: T | null;
  labelFromRecord: (record: T) => string;
  tooltipFromRecord: (record: T) => string;
  children: ReactNode;
}

export function RowDetailView<T>({
  record,
  labelFromRecord,
  tooltipFromRecord,
  children,
}: RowDetailViewProps<T>) {
  if (!record) {
    return null; // optionally show "Nothing Selected"
  }

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ borderBottom: '1px solid #ccc', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6">{labelFromRecord(record)}</Typography>
        <Tooltip title={tooltipFromRecord(record)}>
          <IconButton size="small">
            <HelpOutlineIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </CardContent>

      {/* Body area stretches */}
      <Box sx={{ flexGrow: 1, overflow: 'auto', padding: 2 }}>
        {children}
      </Box>
    </Card>
  );
}
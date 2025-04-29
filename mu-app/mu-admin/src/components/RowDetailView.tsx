import { Card, Typography, Box, Tooltip, IconButton } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { ReactNode } from 'react';
import { RowSelector } from './RowSelector';

interface RowDetailViewProps<T> {
  record: T | null;
  labelFromRecord: (record: T) => string;
  tooltipFromRecord: (record: T) => string;
  children: ReactNode;
  resourceName?: string;
  onSelect?: (record: T) => void;
  selectorIsHeader?: boolean;
}

export function RowDetailView<T>({
  record,
  labelFromRecord,
  tooltipFromRecord,
  children,
  resourceName,
  onSelect,
  selectorIsHeader,
}: RowDetailViewProps<T>) {
  if (!record) {
    return null; // optionally show "Nothing Selected"
  }

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          bgcolor: 'grey.100',
          px: 2,
          py: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTopLeftRadius: 4,
          borderTopRightRadius: 4,
        }}
      >
        {selectorIsHeader && resourceName && onSelect ? (
          <RowSelector
            resourceName={resourceName}
            onSelect={onSelect}
            record={record}
            selectorIsHeader
            mapOption={(r) => (r.name || r.id)}
          />
        ) : (
          <>
            <Typography variant="h6">{labelFromRecord(record)}</Typography>
            <Tooltip title={tooltipFromRecord(record)}>
              <IconButton size="small">
                <HelpOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </>
        )}
      </Box>

      <Box sx={{ flexGrow: 1, overflow: 'auto', padding: 2 }}>
        {children}
      </Box>
    </Card>
  );
}
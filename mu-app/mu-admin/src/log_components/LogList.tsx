import { List, Datagrid, FunctionField, useRefresh } from 'react-admin';
import { useEffect, useState } from 'react';

export function LogList() {
  const refresh = useRefresh();
  const [autoRefresh, setAutoRefresh] = useState(false);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      refresh();
    }, 5000); // 5 seconds
    return () => clearInterval(interval);
  }, [autoRefresh, refresh]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
        <h3>Log Viewer</h3>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <input type="text" placeholder="Character ID" style={{ flex: 1 }} />
          <select style={{ flex: 1 }}>
            <option>Select Mission</option>
            <option>Mission Onboarding</option>
            <option>Mission Exploration</option>
          </select>
          <button>On Board Player</button>
          <button>On Board Character</button>
          <button>Reset Virsona</button>
          <button>Close Mission</button>
          <label style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              style={{ marginRight: '0.5rem' }}
            />
            Auto Refresh
          </label>
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'auto', marginTop: '1rem' }}>
        <List resource="enriched_logs">
          <Datagrid rowClick="show" sort={{ field: 'created_at', order: 'DESC' }}>
            <FunctionField
              label="Date"
              render={(record) => {
                const date = new Date(record.created_at);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }}
            />
            <FunctionField
              label="Time"
              render={(record) => {
                const date = new Date(record.created_at);
                return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds().toString().padStart(3, '0')}`;
              }}
            />
            <FunctionField
              label="Type"
              render={(record) => record.event_type_name || '--'}
            />
            <FunctionField
              label="Message"
              render={(record) => record.payload?.message || '--'}
            />
            <FunctionField
              label="Payload"
              render={(record) => JSON.stringify(record.payload)}
            />
            <FunctionField
              label="ID"
              render={(record) => record.id}
            />
          </Datagrid>
        </List>
      </div>
    </div>
  );
}
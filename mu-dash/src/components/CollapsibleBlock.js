import React, { useState } from 'react';

export default function CollapsibleBlock({ title, runFunction }) {
  const [isOpen, setIsOpen] = useState(false);
  const [output, setOutput] = useState(null);

  const handleRun = async () => {
    const result = await runFunction();
    setOutput(result);
  };

  return (
    <div style={{ border: '1px solid #ccc', marginBottom: '1rem', padding: '1rem' }}>
      <div onClick={() => setIsOpen(!isOpen)} style={{ cursor: 'pointer', fontWeight: 'bold' }}>
        {isOpen ? '▼' : '▶️'} {title}
      </div>

      {isOpen && (
        <div style={{ marginTop: '1rem' }}>
          <button onClick={handleRun}>Run</button>

          {output && (
            <pre style={{ textAlign: 'left', marginTop: '1rem' }}>
              {JSON.stringify(output, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
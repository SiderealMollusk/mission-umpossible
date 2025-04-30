import React, { useState } from 'react';

export default function CollapsibleBlock({ title, runFunction, inputs = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [output, setOutput] = useState(null);
  const [showSource, setShowSource] = useState(false);
  const [formValues, setFormValues] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleRun = async () => {
    const result = await runFunction(formValues);
    setOutput(result);
  };

  return (
    <div style={{ border: '1px solid #ccc', marginBottom: '1rem', padding: '1rem' }}>
      <div onClick={() => setIsOpen(!isOpen)} style={{ cursor: 'pointer', fontWeight: 'bold' }}>
        {isOpen ? '▼' : '▶️'} {title}
      </div>

      {isOpen && (
        <div style={{ marginTop: '1rem' }}>
          {inputs.map((input) => (
            <div key={input.name} style={{ marginBottom: '0.5rem' }}>
              <input
                name={input.name}
                type={input.type}
                placeholder={input.placeholder}
                value={formValues[input.name] || ''}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.5rem' }}
              />
            </div>
          ))}

          <button onClick={handleRun}>Run</button>
          <button onClick={() => setShowSource(!showSource)} style={{ marginLeft: '1rem' }}>
            {showSource ? 'Hide Source' : 'Show Source'}
          </button>

          {output && (
            <pre style={{ textAlign: 'left', marginTop: '1rem', backgroundColor: '#f7f7f7', padding: '1rem' }}>
              {JSON.stringify(output, null, 2)}
            </pre>
          )}

          {showSource && (
            <pre style={{ backgroundColor: '#f0f0f0', padding: '1rem', marginTop: '1rem', textAlign: 'left', overflowX: 'auto' }}>
              {runFunction.toString()}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
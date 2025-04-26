import React from 'react';
import CollapsibleBlock from '../components/CollapsibleBlock';

const experiments = [
  {
    title: 'Fetch User By ID',
    runFunction: async ({ userId }) => {
      return { message: `Pretend we fetched user with ID: ${userId}` };
    },
    inputs: [
      { name: 'userId', type: 'text', placeholder: 'Enter User ID' }
    ]
  },
  {
    title: 'Sum Two Numbers',
    runFunction: async ({ a, b }) => {
      const sum = Number(a) + Number(b);
      return { result: sum };
    },
    inputs: [
      { name: 'a', type: 'number', placeholder: 'First number' },
      { name: 'b', type: 'number', placeholder: 'Second number' }
    ]
  },
  {
    title: 'Echo Text',
    runFunction: async ({ text }) => {
      return { echo: text };
    },
    inputs: [
      { name: 'text', type: 'text', placeholder: 'Say something' }
    ]
  }
];

export default function Lab() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Experiment Lab</h1>

      {experiments.map((exp, index) => (
        <CollapsibleBlock
          key={index}
          title={exp.title}
          runFunction={exp.runFunction}
          inputs={exp.inputs}
        />
      ))}
    </div>
  );
}
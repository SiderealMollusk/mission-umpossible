import React from 'react';
import CollapsibleBlock from '../components/CollapsibleBlock'; // (once we make it)

export default function Lab() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Experiment Lab</h1>

      <CollapsibleBlock
        title="Fetch Users"
        runFunction={async () => {
          // dummy placeholder logic for now
          return { message: "Fetched users (fake)" };
        }}
      />

      <CollapsibleBlock
        title="Fetch Messages"
        runFunction={async () => {
          return { message: "Fetched messages (fake)" };
        }}
      />

    </div>
  );
}
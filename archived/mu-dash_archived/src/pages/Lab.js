import React from 'react';
import CollapsibleBlock from '../components/CollapsibleBlock';
import { supabase } from '../supabaseClient';

const experiments = [
  {
    title: 'Sign In with Fixed Email + Password',
    runFunction: async ({ email, password }) => {
      console.log('[SignIn] Attempting sign in with:', { email });
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email :"virgil.prime@proton.me",
          password: "^CCdz7JJ"
        });
        
        if (error) {
          console.error('[SignIn] Sign in failed:', error.message);
          throw new Error(error.message);
        }
        
        console.log('[SignIn] Sign in successful:', data);
        return data;
      } catch (err) {
        console.error('[SignIn] Unexpected error during sign in:', err);
        throw err;
      }
    },
    inputs: [
      { name: 'email', type: 'email', placeholder: 'Enter your email', defaultValue: 'virgil.prime@proton.me' },
      { name: 'password', type: 'password', placeholder: 'Enter your password', defaultValue: '^CCdz7JJ' }
    ]
  },
  {
    title: 'Sign In with Email + Password >.<',
    runFunction: async ({ email, password }) => {
      console.log('[SignIn] Attempting sign in with:', { email });
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) {
          console.error('[SignIn] Sign in failed:', error.message);
          throw new Error(error.message);
        }
        
        console.log('[SignIn] Sign in successful:', data);
        return data;
      } catch (err) {
        console.error('[SignIn] Unexpected error during sign in:', err);
        throw err;
      }
    },
    inputs: [
      { name: 'email', type: 'email', placeholder: 'Enter your email', defaultValue: 'virgil.prime@proton.me' },
      { name: 'password', type: 'password', placeholder: 'Enter your password', defaultValue: '^CCdz7JJ' }
    ]
  },
  {
    title: 'Test Supabase Auth: Get User',
    runFunction: async () => {
      const { data, error } = await supabase.auth.getUser();
  
      if (error) {
        throw new Error(error.message);
      }
  
      return data;
    },
    inputs: []
  },
  {
    title: 'Log Supabase Client Config',
    runFunction: async () => {
      console.log('Supabase URL:', process.env.REACT_APP_SUPABASE_URL);
      console.log('Supabase Anon Key:', process.env.REACT_APP_SUPABASE_ANON_KEY);
      return { 
        url: process.env.REACT_APP_SUPABASE_URL,
        anonKey: process.env.REACT_APP_SUPABASE_ANON_KEY 
      };
    },
    inputs: []
  },
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
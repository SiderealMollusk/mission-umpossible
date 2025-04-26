import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, '../../.env');
const env = dotenv.parse(fs.readFileSync(envPath));

if (!env.SUPABASE_JWT_SECRET) {
  console.log('No SUPABASE_JWT_SECRET found, generating a new one...');
  env.SUPABASE_JWT_SECRET = crypto.randomBytes(32).toString('hex');
}

// Create new anon JWT
const anonPayload = {
  role: 'anon'
};

const newAnonToken = jwt.sign(anonPayload, env.SUPABASE_JWT_SECRET, {
  algorithm: 'HS256'
});

// Replace in memory
env.SUPABASE_ANON_KEY = newAnonToken;

// Ensure PGRST_JWT_SECRET matches SUPABASE_JWT_SECRET
env.PGRST_JWT_SECRET = env.SUPABASE_JWT_SECRET;

// Write updated .env
const updatedEnv = Object.entries(env)
  .map(([key, value]) => `${key}=${value}`)
  .join('\n') + '\n';

fs.writeFileSync(envPath, updatedEnv);

console.log('✅ Updated SUPABASE_ANON_KEY and PGRST_JWT_SECRET in .env');

/**
 * Requires `pg` to be installed:
 * 
 *   npm install pg
 *   npm install --save-dev @types/pg
 */
import 'dotenv/config';
import { Client } from 'pg';

export function getDbClient() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  return client;
}

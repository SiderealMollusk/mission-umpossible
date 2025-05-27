#!/usr/bin/env node

import dotenv from 'dotenv';
import path from 'path';
// Load environment variables from project root .env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { readdirSync, readFileSync } from 'fs';
import { Client } from 'pg';
import { v4 as uuidv4 } from 'uuid';

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('Error: DATABASE_URL environment variable is not set.');
    process.exit(1);
  }

  const client = new Client({ connectionString: databaseUrl });
  await client.connect();

  const specsDir = path.resolve(__dirname, 'activitySpecs');
  const files = readdirSync(specsDir).filter(f => f.endsWith('.json'));

  try {
    for (const file of files) {
      const filePath = path.join(specsDir, file);
      const raw = readFileSync(filePath, 'utf8');
      const spec = JSON.parse(raw);

      // Ensure an 'id' field
      const id = spec.id ?? uuidv4();
      spec.id = id;

      // Upsert into activities table
      const text = `
        INSERT INTO activities (id, spec)
        VALUES ($1, $2::jsonb)
        ON CONFLICT (id) DO UPDATE
          SET spec = EXCLUDED.spec
      `;
      const values = [id, spec];
      await client.query(text, values);

      console.log(`✅ Seeded activity "${spec.title}" (id=${id})`);
    }
    console.log('\n🎉 All activities have been seeded.\n');
  } catch (err) {
    console.error('Error seeding activities:', err);
  } finally {
    await client.end();
  }
}

main();
import { getDbClient } from "../db";
import { writeFileSync } from 'fs';

async function dumpDbStructure() {
  const client = getDbClient();
  await client.connect();

  const result = await client.query(`
    select table_name, column_name, data_type
    from information_schema.columns
    where table_schema = 'public'
    order by table_name, ordinal_position;
  `);

  const output = result.rows.map((row: { table_name: string; column_name: string; data_type: string }) =>
    `${row.table_name}\t${row.column_name}\t${row.data_type}`
  ).join('\n');

  writeFileSync('../tmp/db_structure.txt', output);
  await client.end();
}

dumpDbStructure().catch((err) => {
  console.error('Failed to dump DB structure:', err);
  process.exit(1);
});
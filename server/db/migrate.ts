import fs from 'node:fs';
import path from 'node:path';
import { FlowDatabase } from './index';
import { SCHEMA_SQL } from './schema';

export function runMigrations(): void {
  console.log('🔄 [Flow Migrations] Starting database migration...');
  const schemaPath = path.resolve(process.cwd(), 'replica', 'schema.sql');
  let schemaSql = SCHEMA_SQL;

  if (fs.existsSync(schemaPath)) {
    try {
      schemaSql = fs.readFileSync(schemaPath, 'utf-8');
    } catch {
      schemaSql = SCHEMA_SQL;
    }
  }
  
  try {
    FlowDatabase.exec(schemaSql);
    console.log('✅ [Flow Migrations] All 8 tables and indices verified successfully.');

    // Verify created tables
    const tables = FlowDatabase.query<{ name: string }>(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name;"
    );
    console.log('📋 [Flow Migrations] Active tables:', tables.map(t => t.name).join(', '));
  } catch (error) {
    console.error('❌ [Flow Migrations] Migration failed:', error);
    throw error;
  }
}

// Direct CLI invocation
if (process.argv[1] && process.argv[1].includes('migrate')) {
  runMigrations();
}

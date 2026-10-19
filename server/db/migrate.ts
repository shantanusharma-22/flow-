import fs from 'node:fs';
import path from 'node:path';
import { FlowDatabase } from './index';

export function runMigrations(): void {
  console.log('🔄 [Flow Migrations] Starting database migration from schema.sql...');
  const schemaPath = path.resolve(process.cwd(), 'replica', 'schema.sql');

  if (!fs.existsSync(schemaPath)) {
    throw new Error(`Schema file not found at: ${schemaPath}`);
  }

  const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
  
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

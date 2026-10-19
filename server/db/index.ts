import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';

const DB_DIR = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const DB_PATH = process.env.DATABASE_PATH || path.join(DB_DIR, 'flow.db');

export class FlowDatabase {
  private static instance: DatabaseSync | null = null;

  public static getDb(): DatabaseSync {
    if (!this.instance) {
      this.instance = new DatabaseSync(DB_PATH);
      // Enable Write-Ahead Logging for high-throughput concurrency
      this.instance.exec('PRAGMA journal_mode = WAL;');
      this.instance.exec('PRAGMA foreign_keys = ON;');
      this.instance.exec('PRAGMA synchronous = NORMAL;');
    }
    return this.instance;
  }

  public static query<T = any>(sql: string, params: any[] = []): T[] {
    const db = this.getDb();
    const stmt = db.prepare(sql);
    return stmt.all(...params) as T[];
  }

  public static get<T = any>(sql: string, params: any[] = []): T | undefined {
    const db = this.getDb();
    const stmt = db.prepare(sql);
    return stmt.get(...params) as T | undefined;
  }

  public static run(sql: string, params: any[] = []): { changes: number | bigint; lastInsertRowid: number | bigint } {
    const db = this.getDb();
    const stmt = db.prepare(sql);
    const result = stmt.run(...params);
    return {
      changes: result.changes,
      lastInsertRowid: result.lastInsertRowid
    };
  }

  public static exec(sql: string): void {
    const db = this.getDb();
    db.exec(sql);
  }
}

import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';
import createInventoryTable from './createInventoryTable';
import createUserTable from './createUserTable';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = process.env.NODE_ENV === 'production'
  ? resolve('/tmp', 'db.sqlite')
  : resolve(__dirname, './db.sqlite');

const dbDir = process.env.NODE_ENV === 'production' ? '/tmp' : __dirname;
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

let db: Database.Database;

try {
  db = new Database(dbPath);
  console.log(`Database initialized at: ${dbPath}`);
} catch (error) {
  console.error('Failed to initialize database:', error);
  db = new Database(':memory:');
  console.log('Falling back to in-memory database');
}

function initializeDatabase() {
  try {
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  } catch (error) {
    console.error('Error initializing database settings:', error);
  }
}

function setupDatabase() {
  initializeDatabase();
  createInventoryTable(db);
  createUserTable(db);
}

setupDatabase();

export default db as Database.Database;
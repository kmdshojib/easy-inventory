import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(resolve(__dirname, './db.sqlite'));

// Initialize the database with basic settings
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export default db;

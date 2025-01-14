import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import createInventoryTable from "./createInventoryTable.js";
import createUserTable from "./createUserTable.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Different database paths for development and production
const dbPath = process.env.NODE_ENV === 'production'
  ? resolve('/tmp', 'db.sqlite')
  : resolve(__dirname, './db.sqlite');

let db;

try {
  db = new Database(dbPath);
  console.log(`Database initialized at: ${dbPath}`);
} catch (error) {
  console.error('Failed to initialize database:', error);
  // Fallback to memory database if file access fails
  db = new Database(':memory:');
  console.log('Falling back to in-memory database');
}

// Initialize the database with basic settings
function initializeDatabase() {
  try {
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  } catch (error) {
    console.error('Error initializing database settings:', error);
  }
}

// Execute the initialization and table creation
function setupDatabase() {
  initializeDatabase();
  createInventoryTable(db);
  createUserTable(db);
}

setupDatabase();

export default db;

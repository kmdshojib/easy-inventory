import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(resolve(__dirname, './db.sqlite'));

// Initialize the database with basic settings
function initializeDatabase() {
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
}

// Create the inventory table if it doesn't exist
function createInventoryTable() {
  db.prepare(`
    CREATE TABLE IF NOT EXISTS inventory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL
    )
  `).run();
  console.log('Inventory table initialized.');
}

// Execute the initialization and table creation
function setupDatabase() {
  initializeDatabase();
  createInventoryTable();
}

setupDatabase();

export default db;

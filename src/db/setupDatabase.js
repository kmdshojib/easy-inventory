import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Use a temporary directory for SQLite on Vercel
// const db = new Database(resolve(__dirname, './db.sqlite')); // Change this to a writable path if needed
const dbPath = resolve('/tmp', 'db.sqlite');
const db = new Database(dbPath);

// Initialize the database with basic settings
function initializeDatabase() {
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
}

// Create tables
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

function createUserTable() {
  db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )
  `).run();
  console.log('User table initialized.');
}

// Execute the initialization and table creation
function setupDatabase() {
  initializeDatabase();
  createInventoryTable();
  createUserTable();
}

setupDatabase();

export default db;

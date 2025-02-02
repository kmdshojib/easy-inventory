import type Database from 'better-sqlite3';

export default function createUserTable(db: Database.Database) {
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
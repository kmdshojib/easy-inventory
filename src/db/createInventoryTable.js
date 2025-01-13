import db from "./setupDatabase";

export function createInventoryTable() {
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
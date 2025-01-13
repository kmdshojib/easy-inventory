import { NextRequest, NextResponse } from 'next/server';
import db from './../../../db/setupDatabase';

export async function POST(req: NextRequest) {
    try {
        const { name, quantity, price } = await req.json();

        if (!name || typeof quantity !== 'number' || typeof price !== 'number') {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
        }

        const statement = db.prepare(`
            INSERT INTO inventory (name, quantity, price)
            VALUES (?, ?, ?)
        `);
        const result = statement.run(name, quantity, price);

        if (result.changes === 0) {
            return NextResponse.json({ error: 'Failed to add inventory item' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Inventory item added successfully', id: result.lastInsertRowid }, { status: 201 });
    } catch (error) {
        console.error('Error adding inventory item:', error);
        return NextResponse.json({ error: 'Internal server error', details: (error as Error).message }, { status: 500 });
    }
}

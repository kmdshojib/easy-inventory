import { NextRequest, NextResponse } from 'next/server';
import db from './../../../db/setupDatabase';

export async function POST(req: NextRequest) {
    try {
        // Parse the request body directly
        const body = await req.json(); // Await the parsing of the JSON body
        const { name, quantity, price } = body;

        // Validate input
        if (!name || typeof quantity !== 'number' || typeof price !== 'number') {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
        }

        // Insert data into the inventory table
        const statement = db.prepare(`
            INSERT INTO inventory (name, quantity, price)
            VALUES (?, ?, ?)
        `);
        statement.run(name, quantity, price);

        return NextResponse.json({ message: 'Inventory item created successfully' }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating inventory:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}

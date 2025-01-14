import db from "@/db/setupDatabase";
import { NextRequest, NextResponse } from "next/server";


export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    // Await the params to access the id
    const { id } = await params; // Extract the ID from the route parameters

    if (!id) {
        return NextResponse.json({ error: 'ID parameter is required' }, { status: 400 });
    }

    try {
        // Parse the request body
        const body = await req.json();
        const { name, quantity, price } = body;

        // Validate input
        if (!name || typeof quantity !== 'number' || typeof price !== 'number') {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
        }

        // Update the inventory item in the database
        const statement =await db.prepare(`
            UPDATE inventory
            SET name = ?, quantity = ?, price = ?
            WHERE id = ?
        `);
        const result = await statement.run(name, quantity, price, id); // Execute the update

        if (result.changes === 0) {
            return NextResponse.json({ error: 'Inventory item not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Inventory item updated successfully', status: 200 });
    } catch (error: any) {
        console.error('Error updating inventory item:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
} 
import { NextRequest, NextResponse } from "next/server";
import db from "@/db/setupDatabase";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params; // Extract the ID from the route parameters

    if (!id) {
        return NextResponse.json({ error: 'ID parameter is required' }, { status: 400 });
    }

    try {
        // Query to get a single inventory item by ID
        const statement = db.prepare(`SELECT * FROM inventory WHERE id = ?`);
        const inventoryItem = statement.get(id); // Fetch the item

        if (!inventoryItem) {
            return NextResponse.json({ error: 'Inventory item not found' }, { status: 404 });
        }

        return NextResponse.json(inventoryItem, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching inventory item:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
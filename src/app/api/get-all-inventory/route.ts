import db from "@/db/setupDatabase";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Query to get all inventory items
        const statement = db.prepare(`SELECT * FROM inventory`);
        const inventoryItems = statement.all(); // Fetch all items

        return NextResponse.json(inventoryItems, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching inventory:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
import db from '@/db/setupDatabase';
import { NextResponse } from "next/server";


export async function GET() {
    try {
        const statement: any = await db.prepare(`
            SELECT * FROM inventory 
            ORDER BY id DESC
        `);
        const inventoryItems = statement.all();
        return NextResponse.json(inventoryItems, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching inventory:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
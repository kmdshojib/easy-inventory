import { NextRequest, NextResponse } from "next/server";
import db from "@/db/setupDatabase";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    // Await the params to access the id
    const { id } = await params; // Extract the ID from the route parameters

    if (!id) {
        return NextResponse.json({ error: 'ID parameter is required' }, { status: 400 });
    }

    try {
        // Prepare the delete statement
        const statement = db.prepare(`DELETE FROM inventory WHERE id = ?`);
        const result = statement.run(id); // Execute the delete

        if (result.changes === 0) {
            return NextResponse.json({ error: 'Inventory item not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Inventory item deleted successfully' }, { status: 200 });
    } catch (error: any) {
        console.error('Error deleting inventory item:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}

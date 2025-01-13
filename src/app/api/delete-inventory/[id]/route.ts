import { NextRequest, NextResponse } from "next/server";
import db from "@/db/setupDatabase";

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    if (!id) {
        return NextResponse.json({ error: 'ID parameter is required' }, { status: 400 });
    }

    try {
        const statement = db.prepare(`DELETE FROM inventory WHERE id = ?`);
        const result = statement.run(id);

        if (result.changes === 0) {
            return NextResponse.json({ error: 'Inventory item not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Inventory item deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting inventory item:', error);
        return NextResponse.json({
            error: 'Internal server error',
            details: (error as Error).message
        }, { status: 500 });
    }
}

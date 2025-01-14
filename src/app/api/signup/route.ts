import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt"; // Make sure to install bcrypt
import db from "@/db/setupDatabase";

export async function POST(req: NextRequest) {
    try {
        const { name, email, password } = await req.json();

        // Validate input
        if (!name || !email || !password) {
            return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into the database
        const statement = await db.prepare(`
            INSERT INTO users (name, email, password)
            VALUES (?, ?, ?)
        `);
        await statement.run(name, email, hashedPassword);

        return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json({ error: 'Internal server error', details: (error as Error).message }, { status: 500 });
    }
}
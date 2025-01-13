import { NextRequest, NextResponse } from "next/server";
import db from "@/db/setupDatabase";
import bcrypt from "bcrypt"; // Make sure to install bcrypt

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        // Validate input
        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        // Fetch user from the database
        const statement = db.prepare(`SELECT * FROM users WHERE email = ?`);
        const user = statement.get(email);

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        // Compare the password with the hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
        }

        // Successful sign-in
        return NextResponse.json({
            message: 'Sign-in successful', user: {
                name: user.name,
                id: user.id,
                email: user.email
            }
        }, { status: 200 });
    } catch (error) {
        console.error('Error signing in:', error);
        return NextResponse.json({ error: 'Internal server error', details: (error as Error).message }, { status: 500 });
    }
}

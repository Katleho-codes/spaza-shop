// lib/get-session.ts (Server Only)
import { headers } from "next/headers";

export async function getSession() {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/get-session`,
        {
            headers: Object.fromEntries(headers()), // Forward cookies to Express
        },
    );
    if (!response.ok) return null;
    return response.json();
}

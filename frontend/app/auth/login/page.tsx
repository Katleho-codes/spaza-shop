"use client"
import { authClient } from '@/lib/auth-client';
import React from 'react'

export default function page() {

    async function logMeIn() {
        const { data, error } = await authClient.signIn.email({
            email: "katlehomabala3@gmail.com", // required
            password: "P4wdDa4y.6z1", // required
            rememberMe: true,
            callbackURL: "http://localhost:3000",
        });
        console.log('login data', data)
        if (error) console.error("login error", error);
    }

    return (
        <div>
            <p>Login</p>
            <button type='button' onClick={logMeIn}>Login</button>
        </div>

    )
}

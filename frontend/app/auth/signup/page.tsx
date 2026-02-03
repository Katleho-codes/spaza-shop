"use client"
import { authClient } from '@/lib/auth-client';
import React from 'react'
import { faker } from '@faker-js/faker';
export default function page() {

    async function SignMeUp() {
        const { data, error } = await authClient.signUp.email({
            name: fakeUser.name,
            email: fakeUser.email,
            password: fakeUser.password,
            image: fakeUser.image,
            callbackURL: "http://localhost:3000",
        });
        console.log('signup data', data)
        if (error) console.error("signup error", error);
    }


    const fakeUser = {
        name: faker.person.fullName(),                // required
        email: faker.internet.email().toLowerCase(),  // required
        password: faker.internet.password({
            length: 12,
            memorable: false,
        }),                                           // required
        image: faker.image.avatar(),
        callbackURL: faker.internet.url(),
    };


    return (
        <div>
            <p>Signup</p>
            <button type='button' onClick={SignMeUp}>Signup</button>
        </div>

    )
}

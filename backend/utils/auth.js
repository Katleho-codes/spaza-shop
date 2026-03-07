import { betterAuth } from "better-auth";
import { openAPI } from "better-auth/plugins";
import { Resend } from "resend";
import { getRedisClient } from "../config/redis.js";
import pool from "../db.js";

const redis = await getRedisClient();
const resend = new Resend(process.env.RESEND_TOKEN);

export const auth = betterAuth({
    baseURL: "http://localhost:8000",
    plugins: [openAPI()],
    database: pool,
    // use serial as the id for all auth related tables
    advanced: {
        database: {
            generateId: "serial",
        },
    },
    emailAndPassword: {
        enabled: true,
    },
    user: {
        changeEmail: {
            enabled: true,
            sendChangeEmailConfirmation: async (
                { user, newEmail, url, token },
                request,
            ) => {
                await resend.emails.send({
                    from: "Deliva <onboarding@resend.dev>",
                    to: user.email,
                    subject: "Verify your Deliva email",
                    html: `
                                <h2>Welcome to Deliva!</h2>
                                <p>Click the link below to verify your email address:</p>
                                <a href="${url}">Verify Email</a>
                                <p>This link expires in 24 hours.</p>
                 `,
                });
                // void sendEmail({
                //     to: user.email, // Sent to the CURRENT email
                //     subject: "Approve email change",
                //     text: `Click the link to approve the change to ${newEmail}: ${url}`,
                // });
            },
        },
    },
    trustedOrigins: [process.env.CLIENT_URL, process.env.CLIENT_URL_PROD],
    socialProviders: {
        google: {
            prompt: "select_account",
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
    },
    // todo: turn this on, off for dev
    emailVerification: {
        // send a verification email at signup
        // sendOnSignUp: true,
        autoSignInAfterVerification: true,
        async afterEmailVerification(user, request) {
            // Your custom logic here, e.g., grant access to premium features
            console.log(`${user.email} has been successfully verified!`);
        },
        sendVerificationEmail: async ({ user, newEmail, url, token }) => {
            console.log(user, newEmail, url, token);
            // data has: user, url, token
            await resend.emails.send({
                from: "Deliva <onboarding@resend.dev>",
                to: user.email,
                subject: "Verify your Deliva email",
                html: `
                    <h2>Welcome to Deliva!</h2>
                    <p>Click the link below to verify your email address:</p>
                    <a href="${url}">Verify Email</a>
                    <p>This link expires in 24 hours.</p>
                `,
            });
        },
    },
    // redis
    secondaryStorage: {
        get: async (key) => {
            return await redis.get(key);
        },
        set: async (key, value, ttl) => {
            if (ttl) await redis.set(key, value, { EX: ttl });
            // or for ioredis:
            // if (ttl) await redis.set(key, value, 'EX', ttl)
            else await redis.set(key, value);
        },
        delete: async (key) => {
            await redis.del(key);
        },
    },
});

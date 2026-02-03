import { betterAuth } from "better-auth";
import pool from "../db.js";
import { openAPI } from "better-auth/plugins";
import { getRedisClient } from "../config/redis.js";

const redis = await getRedisClient();

export const auth = betterAuth({
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
    trustedOrigins: ["http://localhost:3000"],
    // todo: turn this on, off for dev
    // emailVerification: {
    //     // send a verification email at signup
    //     sendOnSignUp: true,
    //     autoSignInAfterVerification: true,
    //     async afterEmailVerification(user, request) {
    //         // Your custom logic here, e.g., grant access to premium features
    //         console.log(`${user.email} has been successfully verified!`);
    //     },
    // },
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

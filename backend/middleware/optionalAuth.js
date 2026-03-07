import { auth } from "../utils/auth.js";
import { fromNodeHeaders } from "better-auth/node";

export const optionalAuth = async (req, res, next) => {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    });

    // If no session, we don't block. We just don't attach a user.
    req.user = session?.user || null;
    next(); // Always call next() so the request continues!
};

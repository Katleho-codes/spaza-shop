import { Server } from "socket.io";
import httpServer from "../services/http.js";
import "dotenv/config";
export const io = new Server(httpServer, {
    /* options */
    cors: {
        origin: [process.env.CLIENT_URL, process.env.CLIENT_URL_PROD],
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true, // Allow credentials (cookies, authorization headers)
    },
});

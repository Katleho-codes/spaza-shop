import bodyParser from "body-parser";
import express from "express";
import { getRedisClient } from "./config/redis.js";
// import cookieParser from "cookie-parser";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import cors from "cors";
import "dotenv/config";
import helmet from "helmet";
import { router as carts } from "./routes/carts/index.js";
import { router as orders } from "./routes/orders/orders.js";
import { router as products } from "./routes/products/products.js";
import { router as search } from "./routes/search/index.js";
import { router as stores } from "./routes/stores/stores.js";
import { router as dashboardStores } from "./routes/dashboard/stores/index.js";
import { router as uploads } from "./routes/uploads/index.js";

import app from "./services/app.js";
import httpServer from "./services/http.js";
import { io } from "./services/io.js";
import { auth } from "./utils/auth.js";
const port = process.env.PORT;

const corsOptions = {
    origin: [process.env.CLIENT_URL, process.env.CLIENT_URL_PROD],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};

io.use(async (socket, next) => {
    try {
        // reuse your existing better-auth session check
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(socket.request.headers),
        });

        if (!session) {
            return next(new Error("Unauthorized"));
        }

        // attach user to socket — same as req.user in middleware
        socket.user = session.user;
        next();
    } catch (err) {
        next(new Error("Unauthorized"));
    }
});
io.on("connection", (socket) => {
    // auto join using the authenticated user id — no need for client to emit join
    socket.join(`user:${socket.user.id}`);

    socket.on("disconnect", () => {
        // console.log("client disconnected:", socket.id);
    });
});

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(helmet());
// app.use(cookieParser());

app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express.json()); // Handle JSON requests
app.set("trust proxy", 1); // trust first proxy
app.disable("x-powered-by");

app.use("/api/orders", orders);
app.use("/api/search", search);
app.use("/api/products", products);
app.use("/api/carts", carts);
app.use("/api/stores", stores);
app.use("/api/dashboard/stores/:slug", dashboardStores);
app.use("/api/upload", uploads);

httpServer.listen(port, () => {
    console.log(`Deliva app listening on port ${port}`);
});

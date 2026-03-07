import bodyParser from "body-parser";
import express from "express";
import { getRedisClient } from "./config/redis.js";
// import cookieParser from "cookie-parser";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import cors from "cors";
import crypto from "crypto";
import "dotenv/config";
import helmet from "helmet";
import { router as carts } from "./routes/carts/index.js";
import { router as orders } from "./routes/orders/orders.js";
import { router as products } from "./routes/products/products.js";
import { router as stores } from "./routes/stores/stores.js";

import { auth } from "./utils/auth.js";

const app = express();
const port = process.env.PORT;

const corsOptions = {
    origin: [process.env.CLIENT_URL, process.env.CLIENT_URL_PROD],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};
app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(helmet());
// app.use(cookieParser());

app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express.json()); // Handle JSON requests
app.set("trust proxy", 1); // trust first proxy
app.disable("x-powered-by");

(async () => {
    const redis = await getRedisClient();

    await redis.set("ping", "pong");
    console.log(await redis.get("ping"));
})();

app.use("/api/orders", orders);
app.use("/api/products", products);
app.use("/api/carts", carts);
app.use("/api/stores", stores);


// app.get("/api/me", async (req, res) => {
//     const session = await auth.api.getSession({
//         headers: fromNodeHeaders(req.headers),
//     });
//     return res.json(session);
// });

// todo: remove
app.get("/", (req, res) => {
    res.send(
        "ORD-" +
            crypto.randomBytes(4).toString("hex").toUpperCase() +
            " - " +
            "SKU-" +
            crypto.randomBytes(4).toString("hex").toUpperCase() +
            " " +
            "PID" +
            crypto.randomInt(10_000_000, 100_000_000),
    );
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

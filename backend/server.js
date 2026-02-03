import express from "express";
import { getRedisClient } from "./config/redis.js";
import bodyParser from "body-parser";
// import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import helmet from "helmet";
import "dotenv/config";
import { auth } from "./utils/auth.js";
import crypto from "crypto";
import { router as orders } from "./routes/orders/orders.js";
import { router as products } from "./routes/products/products.js";
import { router as stores } from "./routes/stores/stores.js";

const app = express();
const port = process.env.PORT;

const corsOptions = {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
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
app.use("/api/stores", stores);
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

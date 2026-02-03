import express from "express";
import createOrder from "../../controller/orders/create-order.js";
import getOrdersByStore from "../../controller/orders/get-orders-by-store.js";
import { limiter } from "../../utils/limiter.js";

const router = express.Router();
router.post("/", limiter, createOrder);
router.get("/store/:store_id", getOrdersByStore);
export { router };

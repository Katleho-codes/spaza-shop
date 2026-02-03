import express from "express";
import createProduct from "../../controller/products/create-product.js";
import { limiter } from "../../utils/limiter.js";
import getProducts from "../../controller/products/get_products.js";
const router = express.Router();
router.post("/", limiter, createProduct);
router.get("/", getProducts);
export { router };

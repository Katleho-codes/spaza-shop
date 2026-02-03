import express from "express";
import createStore from "../../controller/stores/create-store.js";
import getAllStores from "../../controller/stores/get-stores.js";
import getStoreByName from "../../controller/stores/get-store-by-name.js";
import { limiter } from "../../utils/limiter.js";

const router = express.Router();
router.post("/", limiter, createStore);
router.get("/", getAllStores);
router.get("/:slug", getStoreByName);
export { router };

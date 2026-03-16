import express from "express";
import createStore from "../../controller/stores/create-store.js";
import getAllStores from "../../controller/stores/get-stores.js";
import getStoreByName from "../../controller/stores/get-store-by-name.js";
import { limiter } from "../../utils/limiter.js";
import { isLoggedIn } from "../../middleware/isLoggedIn.js";
import { optionalAuth } from "../../middleware/optionalAuth.js";
import { isStoreOwner } from "../../middleware/isStoreOwner.js";
import getUserOwnedStores from "../../controller/stores/get_user_owned_stores.js";

const router = express.Router({ mergeParams: true });
router.post("/", limiter, isLoggedIn, createStore);
router.get("/", optionalAuth, getAllStores);
router.get("/my-stores", isLoggedIn, getUserOwnedStores);
router.get("/add", isLoggedIn, getUserOwnedStores);
router.get("/:slug", isLoggedIn, getStoreByName);
// router.get("/staff", getStoreStaff)

export { router };

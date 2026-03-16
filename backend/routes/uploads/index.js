import express from "express";
import uploadStoreImage from "../../controller/uploads/uploadImage.js";
import { isLoggedIn } from "../../middleware/isLoggedIn.js";
import upload from "../../middleware/upload.js";
const router = express.Router();
router.post("/", isLoggedIn, upload.single("image"), uploadStoreImage);
export { router };

import { Router } from "express";
import { addProduct } from "../controllers/product.controller";
import { authMiddleware } from "../middleware/auth";
import { upload } from "../middleware/upload";

const router = Router();

router.post("/add-product", authMiddleware, upload.single("image"), addProduct);

export default router;

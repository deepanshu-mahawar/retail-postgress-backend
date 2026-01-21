import { Router } from "express";
import { addProducts, getProducts } from "../controllers/product.controller";
import { authMiddleware } from "../middleware/auth";
import { upload } from "../middleware/upload";

const router = Router();

router.post(
  "/add-products",
  authMiddleware,
  upload.single("image"),
  addProducts,
);
router.get("/get-products", authMiddleware, getProducts);

export default router;

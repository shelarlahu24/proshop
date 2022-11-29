import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js"
import { createProduct, createProductReview, deleteProduct, getProductById, getProducts, getTopProducts, updateProduct } from "../controllers/productController.js";

const router = express.Router();

// middleware that is specific to this router

router
  .route("/")
  .get(getProducts)
  .post(protect, admin, createProduct)

router
  .route("/top")
  .get(getTopProducts)

router
  .route("/:id/reviews")
  .post(protect, createProductReview)

router
  .route("/:id")
  .get(getProductById)
  .delete(protect, admin, deleteProduct)
  .put(protect, admin, updateProduct)

export default router;
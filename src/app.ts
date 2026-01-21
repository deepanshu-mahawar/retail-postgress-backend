import express from "express";
import authRoutes from "./routes/auth.route";
import productRoutes from "./routes/product.route";

const app = express();

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);

export default app;

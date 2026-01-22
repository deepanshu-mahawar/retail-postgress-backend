import express from "express";
import authRoutes from "./routes/auth.route";
import productRoutes from "./routes/product.route";
import path from "path";

const app = express();

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);
app.use(express.static(path.join(__dirname, "..", "public")));
export default app;

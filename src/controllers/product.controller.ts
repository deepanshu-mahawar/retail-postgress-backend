import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth";
import path from "path";
import fs from "fs";
import { AppDataSource } from "../config/data-source";
import { Product } from "../entity/Product";

const productRepo = AppDataSource.getRepository(Product);

export const addProducts = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId?.toString();
    console.log("User ID:", userId);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { name, price, stock, category, description } = req.body;
    console.log("Request Body:", req.body);
    const image = req.file;
    console.log("Uploaded Image:", image);

    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }

    const uploadDir = path.join(process.cwd(), "public/uploads");
    console.log("Upload Directory:", uploadDir);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filename = `${Date.now()}-${image.originalname}`;
    console.log("Generated Filename:", filename);
    const filePath = path.join(uploadDir, filename);
    console.log("File Path:", filePath);

    fs.writeFileSync(filePath, image.buffer);

    const product = productRepo.create({
      name,
      price: Number(price),
      stock: Number(stock),
      category,
      description,
      image: `/uploads/${filename}`,
      userId,
      sold: 0,
      revenue: 0,
    });
    console.log("Created Product Entity:", product);

    await productRepo.save(product);
    console.log("Product saved to database:", product);

    return res.status(201).json({
      message: "Product created successfully",
      success: true,
      product,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error creating product", success: false });
  }
};

export const getProducts = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId?.toString();
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const products = await productRepo.find({
      where: { userId: userId },
      order: { createdAt: "DESC" },
    });

    return res.status(200).json({
      message: "Products fetched successfully",
      success: true,
      data: products,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching products", success: true });
  }
};

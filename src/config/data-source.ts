import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { User } from "../entity/User";
import { Product } from "../entity/Product";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: "123456",
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [User, Product],
  migrations: [],
});

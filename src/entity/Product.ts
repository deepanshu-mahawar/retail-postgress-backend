import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column()
  price!: number;

  @Column()
  stock!: number;

  @Column()
  category!: string;

  @Column()
  description!: string;

  @Column()
  image!: string;

  @ManyToOne(() => User, (user) => user.products, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user!: User;

  @Column()
  userId!: string;

  @Column({default: 0})
  sold!: number;

  @Column({default: 0})
  revenue!: number;

  @CreateDateColumn()
  createdAt!: Date;
}

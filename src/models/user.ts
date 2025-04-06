import pool from "../config/database";
import { User } from "../types";
import bcrypt from "bcryptjs";

export class UserModel {
  static async create(user: User): Promise<User> {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const [result] = await pool.execute(
      "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
      [user.username, hashedPassword, user.role]
    );
    
    return { ...user, id: (result as any).insertId };
  }

  static async findByUsername(username: string): Promise<User | null> {
    const [rows] = await pool.execute(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );
    const users = rows as User[];
    return users.length ? users[0] : null;
  }

  static async findById(id: number): Promise<User | null> {
    const [rows] = await pool.execute("SELECT * FROM users WHERE id = ?", [id]);
    const users = rows as User[];
    return users.length ? users[0] : null;
  }

  static async verifyPassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}

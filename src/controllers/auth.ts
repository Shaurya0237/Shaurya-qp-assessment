import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user";
import { User } from "../types";

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { username, password, role } = req.body;

      if (!username || !password || !role) {
        return res.status(400).json({ message: "Missing required data !" });
      }

      if (role !== "admin" && role !== "user") {
        return res.status(400).json({ message: "Invalid role !!!" });
      }

      const existingUser = await UserModel.findByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const user: User = {
        username,
        password,
        role,
      };

      const newUser = await UserModel.create(user);
      const token = jwt.sign(
        { userId: newUser.id, role: newUser.role },
        process.env.JWT_SECRET!,
        { expiresIn: "24h" }
      );

      res.status(201).json({
        message: "Sign up successful",
        token,
        user: {
          id: newUser.id,
          username: newUser.username,
          role: newUser.role,
        },
      });
    } catch (error) {
      console.error("Error in register:", error);
      res.status(500).json({ message: "Internal server error", error });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const user = await UserModel.findByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials !!!" });
      }

      const isValidPassword = await UserModel.verifyPassword(
        password,
        user.password
      );
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials !!!" });
      }

      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: "24h" }
      );

      res.json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Error in login:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

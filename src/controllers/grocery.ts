import { Request, Response } from "express";
import { GroceryModel } from "../models/grocery";
import { GroceryItem } from "../types";

export class GroceryController {
  static async create(req: Request, res: Response) {
    try {
      const { name, price, inventory } = req.body;

      if (!name || !price || inventory === undefined) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      if (price <= 0 || inventory < 0) {
        return res
          .status(400)
          .json({ message: "Invalid price or inventory value" });
      }

      const item: GroceryItem = {
        name,
        price,
        inventory,
      };

      const newItem = await GroceryModel.create(item);
      res.status(201).json({
        message: "Grocery item created successfully",
        item: newItem,
      });
    } catch (error) {
      console.error("Error in create grocery:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const items = await GroceryModel.findAll();
      res.json(items);
    } catch (error) {
      console.error("Error in getAll grocery:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, price, inventory } = req.body;

      if (!name && !price && inventory === undefined) {
        return res.status(400).json({ message: "No fields to update" });
      }

      if (price !== undefined && price <= 0) {
        return res.status(400).json({ message: "Invalid price value" });
      }

      if (inventory !== undefined && inventory < 0) {
        return res.status(400).json({ message: "Invalid inventory value" });
      }

      const success = await GroceryModel.update(Number(id), {
        name,
        price,
        inventory,
      });

      if (!success) {
        return res.status(404).json({ message: "Grocery item not found" });
      }

      res.json({ message: "Grocery item updated successfully" });
    } catch (error) {
      console.error("Error in update grocery:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const success = await GroceryModel.delete(Number(id));

      if (!success) {
        return res.status(404).json({ message: "Grocery item not found" });
      }

      res.json({ message: "Grocery item deleted successfully" });
    } catch (error) {
      console.error("Error in delete grocery:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

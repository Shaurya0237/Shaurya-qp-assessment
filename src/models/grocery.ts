import pool from "../config/database";
import { GroceryItem } from "../types";

export class GroceryModel {
  static async create(item: GroceryItem): Promise<GroceryItem> {
    const [result] = await pool.execute(
      "INSERT INTO grocery_items (name, price, inventory) VALUES (?, ?, ?)",
      [item.name, item.price, item.inventory]
    );
    return { ...item, id: (result as any).insertId };
  }

  static async findAll(): Promise<GroceryItem[]> {
    const [rows] = await pool.execute("SELECT * FROM grocery_items");
    return rows as GroceryItem[];
  }

  static async findById(id: number): Promise<GroceryItem | null> {
    const [rows] = await pool.execute(
      "SELECT * FROM grocery_items WHERE id = ?",
      [id]
    );
    const items = rows as GroceryItem[];
    return items.length ? items[0] : null;
  }

  static async update(
    id: number,
    item: Partial<GroceryItem>
  ): Promise<boolean> {
    const updates: string[] = [];
    const values: any[] = [];

    if (item.name) {
      updates.push("name = ?");
      values.push(item.name);
    }
    if (item.price) {
      updates.push("price = ?");
      values.push(item.price);
    }
    if (item.inventory !== undefined) {
      updates.push("inventory = ?");
      values.push(item.inventory);
    }

    if (updates.length === 0) return false;

    values.push(id);
    const [result] = await pool.execute(
      `UPDATE grocery_items SET ${updates.join(", ")} WHERE id = ?`,
      values
    );

    return (result as any).affectedRows > 0;
  }

  static async delete(id: number): Promise<boolean> {
    const [result] = await pool.execute(
      "DELETE FROM grocery_items WHERE id = ?",
      [id]
    );
    return (result as any).affectedRows > 0;
  }

}

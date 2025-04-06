import pool from "../config/database";
import { Order, OrderItem } from "../types";

export class OrderModel {
  static async create(order: Order, items: OrderItem[]): Promise<Order> {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [result] = await connection.execute(
        "INSERT INTO orders (userId, totalAmount, status) VALUES (?, ?, ?)",
        [order.userId, order.totalAmount, order.status]
      );
      const orderId = (result as any).insertId;

      for (const item of items) {
        await connection.execute(
          "INSERT INTO order_items (orderId, groceryItemId, quantity, price) VALUES (?, ?, ?, ?)",
          [orderId, item.groceryItemId, item.quantity, item.price]
        );

        await connection.execute(
          "UPDATE grocery_items SET inventory = inventory - ? WHERE id = ?",
          [item.quantity, item.groceryItemId]
        );
      }

      await connection.commit();
      return { ...order, id: orderId };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async findByUserId(userId: number): Promise<Order[]> {
    const [rows] = await pool.execute("SELECT * FROM orders WHERE userId = ?", [
      userId,
    ]);
    return rows as Order[];
  }

  static async findOrderItems(orderId: number): Promise<OrderItem[]> {
    const [rows] = await pool.execute(
      "SELECT * FROM order_items WHERE orderId = ?",
      [orderId]
    );
    return rows as OrderItem[];
  }
}

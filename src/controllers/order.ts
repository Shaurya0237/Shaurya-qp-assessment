import { Request, Response } from "express";
import { OrderModel } from "../models/order";
import { GroceryModel } from "../models/grocery";
import { Order, OrderItem } from "../types";

export class OrderController {
  static async create(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const { items } = req.body;

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: "Invalid order items" });
      }

      let totalAmount = 0;
      const orderItems: OrderItem[] = [];

      for (const item of items) {
        const { groceryItemId, quantity } = item;

        if (!groceryItemId || !quantity || quantity <= 0) {
          return res.status(400).json({ message: "Invalid item details" });
        }

        const groceryItem = await GroceryModel.findById(groceryItemId);
        if (!groceryItem) {
          return res
            .status(404)
            .json({ message: `Grocery item ${groceryItemId} not found` });
        }

        if (groceryItem.inventory < quantity) {
          return res.status(400).json({
            message: `Insufficient inventory for item ${groceryItem.name}`,
          });
        }

        const itemTotal = groceryItem.price * quantity;
        totalAmount += itemTotal;

        orderItems.push({
          groceryItemId,
          quantity,
          price: groceryItem.price,
        });
      }

      const order: Order = {
        userId,
        totalAmount,
        status: "completed",
      };

      const newOrder = await OrderModel.create(order, orderItems);
      res.status(201).json({
        message: "Order created successfully",
        order: {
          id: newOrder.id,
          totalAmount: newOrder.totalAmount,
          status: newOrder.status,
        },
      });
    } catch (error) {
      console.error("Error in create order:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getOrders(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const orders = await OrderModel.findByUserId(userId);

      const ordersWithItems = await Promise.all(
        orders.map(async (order) => {
          const items = await OrderModel.findOrderItems(order.id!);
          return {
            ...order,
            items,
          };
        })
      );

      res.json(ordersWithItems);
    } catch (error) {
      console.error("Error in getOrders:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

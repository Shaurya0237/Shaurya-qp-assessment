export interface User {
  id?: number;
  username: string;
  password: string;
  role: "admin" | "user";
  createdAt?: Date;
}

export interface GroceryItem {
  id?: number;
  name: string;
  price: number;
  inventory: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Order {
  id?: number;
  userId: number;
  totalAmount: number;
  status: "pending" | "completed";
  createdAt?: Date;
}

export interface OrderItem {
  id?: number;
  orderId?: number;
  groceryItemId: number;
  quantity: number;
  price: number;
}

export interface JwtPayload {
  userId: number;
  role: string;
  iat?: number;
  exp?: number;
}

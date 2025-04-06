import { Router } from "express";
import { OrderController } from "../controllers/order";
import { authenticate } from "../middleware/auth";

const router = Router();

router.post("/", authenticate, OrderController.create);
router.get("/", authenticate, OrderController.getOrders);

export default router;

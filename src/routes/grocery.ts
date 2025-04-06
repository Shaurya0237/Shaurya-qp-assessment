import { Router } from "express";
import { GroceryController } from "../controllers/grocery";
import { authenticate, authorize } from "../middleware/auth";

const router = Router();

router.post("/", authenticate, authorize(["admin"]), GroceryController.create);
router.put(
  "/:id",
  authenticate,
  authorize(["admin"]),
  GroceryController.update
);
router.delete(
  "/:id",
  authenticate,
  authorize(["admin"]),
  GroceryController.delete
);

router.get("/", GroceryController.getAll);

export default router;

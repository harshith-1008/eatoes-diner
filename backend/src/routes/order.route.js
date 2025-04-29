import { Router } from "express";
import { createOrder, getUserOrders } from "../controllers/order.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create-order").post(verifyJWT, createOrder);
router.route("/orders").get(verifyJWT, getUserOrders);

export default router;

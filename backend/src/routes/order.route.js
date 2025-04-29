import { Router } from "express";
import { createOrder, getUserOrders } from "../controllers/order.controller";

const router = Router();

router.route("/orders").post(createOrder);
router.route("/orders").get(getUserOrders);

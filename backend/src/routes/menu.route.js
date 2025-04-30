import { Router } from "express";
import {
  getMenuItems,
  getSingleItem,
  addMenuItem,
  updateMenuItem,
} from "../controllers/menu.controller.js";

const router = Router();

router.route("/").get(getMenuItems);
router.route("/:id").get(getSingleItem);
router.route("/add").post(addMenuItem);
router.route("/update/:id").put(updateMenuItem);

export default router;

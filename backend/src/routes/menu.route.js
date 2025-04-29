import { Router } from "express";
import {
  getMenuItems,
  getSingleItem,
  addMenuItem,
} from "../controllers/menu.controller.js";

const router = Router();

router.route("/").get(getMenuItems);
router.route("/:id").get(getSingleItem);
router.route("/add").post(addMenuItem);

export default router;

import { Router } from "express";
import { getMenuItems, getSingleItem } from "../controllers/menu.controller";

const router = Router();

router.route("/").get(getMenuItems);
router.route("/:id").get(getSingleItem);

export default router;

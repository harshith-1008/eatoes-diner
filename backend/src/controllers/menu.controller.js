import MenuItem from "../models/menu.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getMenuItems = asyncHandler(async (req, res) => {
  const { category } = req.query;

  let filter = {};
  if (category) {
    filter.category = category;
  }

  const menuItems = await MenuItem.find(filter);

  if (menuItems.length === 0) {
    throw new apiError(404, "No menu items found at this time");
  }

  return res
    .status(200)
    .json(new apiResponse(200, menuItems, "Menu fetched successfully"));
});

export const getSingleItem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const menuItem = await MenuItem.findById(id);

  if (!menuItem) {
    throw new apiError(404, "Menu item not found");
  }

  return res
    .status(200)
    .json(new apiResponse(200, menuItem, "Item fetched successfully"));
});

import { MenuItem } from "../models/menu.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getMenuItems = asyncHandler(async (req, res) => {
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

const getSingleItem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const menuItem = await MenuItem.findById(id);

  if (!menuItem) {
    throw new apiError(404, "Menu item not found");
  }

  return res
    .status(200)
    .json(new apiResponse(200, menuItem, "Item fetched successfully"));
});

const addMenuItem = asyncHandler(async (req, res) => {
  const { name, desc, category, price } = req.body;

  if (!name || !desc || !category || price == null) {
    throw new apiError(
      400,
      "All fields (name, desc, category, price) are required"
    );
  }

  const validCategories = ["starter", "main-course", "dessert", "drinks"];
  if (!validCategories.includes(category)) {
    throw new apiError(400, "Invalid category provided");
  }

  const newMenuItem = await MenuItem.create({
    name,
    desc,
    category,
    price,
  });

  return res
    .status(201)
    .json(new apiResponse(201, newMenuItem, "Menu item added successfully"));
});

const updateMenuItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, desc, category, price } = req.body;

  const menuItem = await MenuItem.findById(id);

  if (!menuItem) {
    throw new apiError(404, "Menu item not found");
  }

  if (name !== undefined) menuItem.name = name;
  if (desc !== undefined) menuItem.desc = desc;
  if (category !== undefined) {
    const validCategories = ["starter", "main-course", "dessert", "drinks"];
    if (!validCategories.includes(category)) {
      throw new apiError(400, "Invalid category provided");
    }
    menuItem.category = category;
  }
  if (price !== undefined) menuItem.price = price;

  const updatedItem = await menuItem.save();

  return res
    .status(200)
    .json(new apiResponse(200, updatedItem, "Menu item updated successfully"));
});

export { getMenuItems, getSingleItem, addMenuItem, updateMenuItem };

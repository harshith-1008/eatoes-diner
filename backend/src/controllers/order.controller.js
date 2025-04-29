import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import prisma from "../config/prisma.js";

const createOrder = asyncHandler(async (req, res) => {
  const { orderItems } = req.body;
  console.log(orderItems);
  const userId = req.user.id;
  console.log(userId);
  if (!orderItems || orderItems.length === 0) {
    throw new apiError(400, "No order items provided");
  }

  const totalPrice = orderItems.reduce((acc, item) => acc + item.price, 0);

  const order = await prisma.order.create({
    data: {
      items: orderItems,
      totalPrice: totalPrice,
      userId: userId,
    },
  });
  return res
    .status(201)
    .json(new apiResponse(201, order, "Order placed successfully"));
});

const getUserOrders = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const orders = await prisma.order.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!orders || orders.length === 0) {
    throw new apiError(404, "No orders found for this user");
  }

  return res
    .status(200)
    .json(new apiResponse(200, orders, "Orders fetched successfully"));
});

export { createOrder, getUserOrders };

import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import getPrisma from "../config/prisma.js";

const prisma = await getPrisma();

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new apiError(401, "Unauthorized request, token missing");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await prisma.user.findUnique({
      where: {
        id: decodedToken.id,
      },
    });

    if (!user) {
      throw new apiError(401, "Invalid Access Token, user not found");
    }

    const { password, refreshToken, ...safeUser } = user;
    req.user = safeUser;
    console.log(req.user);
    next();
  } catch (error) {
    throw new apiError(401, error?.message || "Invalid or expired token");
  }
});

import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import prisma from "../config/prisma.js";

const hashPassword = async (plainPassword) => {
  return await bcrypt.hash(plainPassword, 10);
};

const isPasswordCorrect = async (plain, hashed) => {
  return await bcrypt.compare(plain, hashed);
};

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      phone: user.phone,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

const registerUser = asyncHandler(async (req, res) => {
  const { name, phone, password, role } = req.body;
  console.log(name, phone, password, role);

  if (!name || !phone || !password) {
    throw new apiError(400, "All fields are required to register user");
  }

  if (role && !["ADMIN", "CUSTOMER"].includes(role)) {
    throw new apiError(400, "Invalid role provided");
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      phone,
    },
  });

  if (existingUser) {
    throw new apiError(409, "User with phone number already exists");
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name,
      phone,
      password: hashedPassword,
      role: role ? role : "CUSTOMER",
    },
  });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "prod" ? "none" : "lax",
    maxAge: 3 * 24 * 60 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "prod" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(201).json(
    new apiResponse(
      201,
      {
        user: { id: user.id, name: user.name, phone: user.phone },
        accessToken,
        refreshToken,
      },
      "User registered successfully"
    )
  );
});

const loginUser = asyncHandler(async (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    throw new apiError(400, "Fields not enough to login user");
  }

  const user = await prisma.user.findFirst({
    where: {
      phone,
    },
  });

  if (!user) {
    throw new apiError(401, "User with this phone number doesn't exists");
  }

  const isCorrect = await isPasswordCorrect(password, user.password);

  if (!isCorrect) {
    throw new apiError(401, "Invalid password");
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return res.status(200).json(
    new apiResponse(
      200,
      {
        user: { id: user.id, name: user.name, phone: user.phone },
        accessToken,
        refreshToken,
      },
      "Login successful"
    )
  );
});

export { registerUser, loginUser };

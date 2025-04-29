import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

import userRouter from "./routes/user.route.js";
import menuRouter from "./routes/menu.route.js";
import orderRouter from "./routes/order.route.js";

app.use("/api/v1/user", userRouter);
app.use("/api/v1/menu", menuRouter);
app.use("/api/v1/order", orderRouter);

export { app };

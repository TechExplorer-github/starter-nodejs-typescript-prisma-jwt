import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";

const envPath = path.resolve(__dirname, "../.env");
dotenv.config({ path: envPath });
const port = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: process.env.ORIGIN_URL,
  })
);

app.use("/api/auth", authRoutes);

app.listen(port, () => {
  console.log(`Start Port ${port}`);
});

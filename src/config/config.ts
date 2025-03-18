import { CorsOptions } from "cors";
import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || "3000", 10),
  uploadDir: process.env.UPLOAD_DIR || "./uploads",
  baseUrl: process.env.BASE_URL || "http://localhost:3000",
  maxFileSizeMb: parseInt(process.env.MAX_FILE_SIZE_MB || "5", 10),
  jwtSecret: process.env.JWT_SECRET || "tu_secreto",
  minutesLimit: process.env.MINUTES_LIMIT || "1",
};

export const corsConfig: CorsOptions = {
  origin: process.env.ORIGIN
    ? process.env.ORIGIN.trim().split(",")
    : "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};

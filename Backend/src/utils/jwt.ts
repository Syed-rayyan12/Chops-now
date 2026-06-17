import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  // Fail fast: a missing secret means tokens are forgeable. Never fall back to a default.
  throw new Error("JWT_SECRET environment variable is required");
}

export const generateToken = (payload: object) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};

import jwt from "jsonwebtoken";
import { IUser, Role } from "../types/user.types";

const JWT_SECRET = "SUPER_SECRET_KEY";
const EXPIRES_IN = "1d";

export const signToken = (payload: { id: string; role: Role }) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: EXPIRES_IN });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};

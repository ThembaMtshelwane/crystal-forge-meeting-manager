import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../constants/http.codes";
import { verifyToken } from "../utils/jwt";
import { IUser, Role } from "../types/user.types";
import { db } from "../utils/fileDb";

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token) as { id: string; role: Role };
    const user = (db.users as IUser[]).find((u) => u.id === decoded.id);

    if (!user) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: "User not found" });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ message: "Invalid token" });
  }
};

import { Request, Response, NextFunction } from "express";
import { IUser, Role } from "../types/user.types";
import jwt, { JwtPayload } from "jsonwebtoken";
import expressAsyncHandler from "express-async-handler";
import { HttpStatus } from "../constants/http.codes";
import { db } from "../utils/fileDb";
import { JWT_SECRET } from "../constants/env.const";

interface IDecoded extends JwtPayload {
  id: string;
  role: Role;
}

export const protect = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        message: "Not authorized, no token",
      });
      return;
    }
    try {
      const decoded = jwt.verify(accessToken, JWT_SECRET) as IDecoded;
      if (!decoded.id) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          message: "Invalid token structure",
        });
        return;
      }

      const user = (db.users as IUser[]).find((u) => u.id === decoded.id);
      if (!user) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          message: "Not authorized, user not found",
        });
        return;
      }

      const { password, ...userWithoutPassword } = user;
      req.user = userWithoutPassword as IUser;

      next();
    } catch (error) {
      console.error("Token verification failed:", error);
      res.status(HttpStatus.UNAUTHORIZED).json({
        message: "Not authorized, invalid token",
      });
    }
  }
);

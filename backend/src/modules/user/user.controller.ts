import expressAsyncHandler from "express-async-handler";
import { HttpStatus } from "../../constants/http.codes";
import { Request, Response } from "express";
import { db, saveDB } from "../../utils/fileDb";
import type { IUser } from "../../types/user.types";

//Get all users
export const getUsers = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const data = db.users;
    if (!data) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: "No users found",
      });
      return;
    }
    res.status(HttpStatus.OK).json({ data, messgae: "Fetched all users" });
  }
);

//Get user by id
export const getUser = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const user = (db.users as IUser[]).find((r) => r.id === id);
    if (!user) {
      res.status(HttpStatus.NOT_FOUND).json({ message: "User not found" });
      return;
    }
    res.status(HttpStatus.OK).json({
      data: user,
      message: "User found",
    });
  }
);

//Get logged in user by
export const getUserProfile = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    console.log("user  ", req.user);

    const user = (db.users as IUser[]).filter((u) => u.id === userId);
    if (!user) {
      res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: "User profile not found" });
      return;
    }
    res.status(HttpStatus.OK).json({
      data: user,
      message: "User profile found",
    });
  }
);


//Update user by id
export const updateUser = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const updates = req.body;

    const userIndex = db.users.findIndex((r: IUser) => r.id === id);

    if (userIndex === -1) {
      res.status(HttpStatus.NOT_FOUND).json({ message: "User not found" });
    }

    // Filter out undefined fields
    const sanitizedUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    );

    // Merge safely into existing user
    db.users[userIndex] = {
      ...db.users[userIndex],
      ...sanitizedUpdates,
    };

    saveDB(db);

    res.status(HttpStatus.OK).json({
      data: db.users[userIndex],
      message: "User updated successfully",
    });
  }
);

//Deactivate user
export const toogleUserstatus = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const status = req.body.status;
    const userIndex = db.users.findIndex((r: IUser) => r.id === id);
    if (userIndex === -1) {
      res.status(HttpStatus.NOT_FOUND).json({ message: "User not found" });
    }
    db.users[userIndex] = {
      ...db.users[userIndex],
      status,
    };

    saveDB(db);

    res.status(HttpStatus.OK).json({
      data: db.users[userIndex],
      message: "User deactivated successfully",
    });
  }
);

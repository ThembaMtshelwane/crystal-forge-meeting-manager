import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { IUser } from "../../types/user.types";
import { db, saveDB } from "../../utils/fileDb";
import { HttpStatus } from "../../constants/http.codes";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { signToken } from "../../utils/jwt";

export const register = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { firstName, lastName, email, password, username, organisationId } =
      req.body;
    const users = (db.users as IUser[]).filter(
      (u) => u.email === email || u.username === username
    );

    if (users.length) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: "User already exists",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: IUser = {
      id: randomUUID() as string,
      firstName,
      lastName,
      email,
      username,
      password: hashedPassword,
      role: "member",
      status: true,
      organizationId: "org1",
    };

    if (!newUser) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Error: Failed to created a room",
      });
      return;
    }

    db.users.push(newUser);
    saveDB(db);

    const token = signToken({ id: newUser.id, role: newUser.role });

    res.status(HttpStatus.CREATED).json({
      data: {
        firstName,
        lastName,
        email,
        username,
        organisationId: newUser.organizationId,
        role: newUser.role,
        status: newUser.status,
      },
      token,
      message: "You have successfully added a new room",
    });
  }
);

export const login = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const users = db.users as IUser[];

    const userIndex = users.findIndex((u) => u.email === email);
    const user = users[userIndex];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!user || !validPassword) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: "Invalid email or password",
      });
    }

    const token = signToken({ id: user.id, role: user.role });

    res.status(HttpStatus.OK).json({
      message: "Logged in successfully",
      token,
      user,
    });
  }
);

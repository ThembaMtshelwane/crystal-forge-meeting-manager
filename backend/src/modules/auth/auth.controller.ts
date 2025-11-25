import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { IUser } from "../../types/user.types";
import { db, saveDB } from "../../utils/fileDb";
import { HttpStatus } from "../../constants/http.codes";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import generateToken from "../../utils/generateTokens";

export const register = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { firstName, lastName, email, password, username } = req.body;

    // Check if user exists
    const users = (db.users as IUser[]).filter(
      (u) => u.email === email || u.username === username
    );

    if (users.length) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: "User already exists",
      });
      return;
    }

    // Encrypt the password
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
        message: "Error: Failed to created a user",
      });
      return;
    }

    await generateToken(res, newUser);
    db.users.push(newUser);
    saveDB(db);

    const { password: userPassword, ...responseData } = newUser;

    res.status(HttpStatus.CREATED).json({
      data: responseData,
      message: "User registered successfully",
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
      return;
    }

    await generateToken(res, user);

    const { password: userPassword, ...responseData } = user;

    res.status(HttpStatus.OK).json({
      message: "Logged in successfully",
      data: responseData,
    });
  }
);

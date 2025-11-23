import { NODE_ENV } from "../constants/env.const";
import { CookieOptions, Response } from "express";
import generateAccessToken from "./generateAccessToken";
import { IUser } from "../types/user.types";

const generateToken = async (res: Response, user: IUser) => {
  try {
    const accessToken = generateAccessToken(user);

    setAuthCookies(res, accessToken);

    return accessToken;
  } catch (error) {
    console.error("Error generating tokens:", error);
    throw new Error("Failed to generate tokens");
  }
};

const setAuthCookies = (res: Response, accessToken: string) => {
  if (!res.headersSent) {
    res.cookie("accessToken", accessToken, accessCookieOptions());
  } else {
    console.error("Headers already sent; cannot set cookies.");
  }
};

export const setAccessTokenCookies = (res: Response, accessToken: string) => {
  if (!res.headersSent) {
    console.log("new access token cookie created");
    res.cookie("accessToken", accessToken, accessCookieOptions());
  } else {
    console.error("Headers already sent; cannot set cookies.");
  }
};

const accessCookieOptions = (): CookieOptions => ({
  httpOnly: true,
  sameSite: "strict",
  secure: NODE_ENV === "production",
  maxAge: 1000 * 60 * 60 * 15,
  path: "/",
});

export default generateToken;

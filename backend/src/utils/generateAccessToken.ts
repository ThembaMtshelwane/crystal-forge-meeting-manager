import jwt, { SignOptions } from "jsonwebtoken";
import { IUser } from "../types/user.types";
import { JWT_SECRET } from "../constants/env.const";

const generateAccessToken = (user: IUser): string => {
  const jwtOptions: SignOptions = {
    expiresIn: "90d",
    issuer: "ThembaMM3@gmail.com",
    audience: "API V1",
  };

  console.log("jwt secret", JWT_SECRET);

  return jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    JWT_SECRET,
    jwtOptions
  );
};

export default generateAccessToken;

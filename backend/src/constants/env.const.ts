import dotenv from "dotenv";
dotenv.config();

export const NODE_ENV = process.env.NODE_ENV;
export const PORT: number = Number(process.env.PORT || 5000);
export const JWT_SECRET = process.env.JWT_SECRET || "b%t8_5G3v<dxCq6>KyQ,~";

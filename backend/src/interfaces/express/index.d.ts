import { IUser } from "../../types/user.types";

declare global {
  namespace Express {
    interface Request {
      user?: Pick<IUser, "id" | "role">;
      s;
    }
  }
}

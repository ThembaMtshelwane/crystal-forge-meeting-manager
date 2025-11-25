import { Role } from "./user.types.js";

export interface ILinks {
  icon: string;
  title: string;
  value: string;
  roles: Role[];
  path: string;
}

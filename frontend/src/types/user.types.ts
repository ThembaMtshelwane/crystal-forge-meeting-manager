export type Role = "member" | "admin";

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  username: string;
  organizationId: string;
  role: Role;
  status: boolean;
}

export interface IRegisterUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  username: string;
  organizationId: string;
}

export interface ILoginUser {
  email: string;
  password: string;
}

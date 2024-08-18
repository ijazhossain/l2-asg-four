import { Model } from "mongoose";

export type TUser = {
  username: string;
  email: string;
  password: string;
  role: "user" | "admin";
};
interface UserModel extends Model<TUser> {
  isUserExists(username: string): Promise<TUser>;
}

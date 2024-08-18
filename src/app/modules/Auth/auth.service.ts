import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { User } from "../user/user.model";
import { TLoginUser } from "./auth.interface";
import jwt from "jsonwebtoken";
import config from "../../config";
const loginUser = async (payload: TLoginUser) => {
  const userData = await User.isUserExists(payload?.username);
  if (!userData) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is not exists");
  }
  const jwtPayload = {
    username: userData?.username,
    email: userData?.email,
    role: userData?.role,
  };
  const token = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: "1h",
  });
  const user = await User.findOne({ username: userData?.username }).select({
    password: 0,
    __v: 0,
    _id: 0,
    createdAt: 0,
    updatedAt: 0,
  });
  return { user, token };
};
export const AuthServices = {
  loginUser,
};

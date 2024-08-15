import { z } from "zod";

const userValidationSchema = z.object({
  userName: z.string({
    required_error: "User name is required",
    invalid_type_error: "User name must be string",
  }),
  email: z.string({
    required_error: "User name is required",
    invalid_type_error: "User name must be string",
  }),
  password: z.string({
    required_error: "User name is required",
    invalid_type_error: "User name must be string",
  }),
  role: z.enum(["user", "admin"]),
});
const updateUserValidationSchema = z.object({
  userName: z.string({
    required_error: "User name is required",
    invalid_type_error: "User name must be string",
  }),
  email: z.string({
    required_error: "User name is required",
    invalid_type_error: "User name must be string",
  }),
  password: z.string({
    required_error: "User name is required",
    invalid_type_error: "User name must be string",
  }),
  role: z.enum(["user", "admin"]),
});
export const userValidations = {
  userValidationSchema,
  updateUserValidationSchema,
};

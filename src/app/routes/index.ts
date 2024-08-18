import { Router } from "express";
import { ReviewsRoutes } from "../modules/reviews/reviews.route";
import { CategoriesRoutes } from "../modules/category/category.route";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/Auth/auth.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/reviews",
    route: ReviewsRoutes,
  },
  {
    path: "/categories",
    route: CategoriesRoutes,
  },
  {
    path: "/auth",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;

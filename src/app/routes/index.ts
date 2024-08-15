import { Router } from "express";
import { ReviewsRoutes } from "../modules/reviews/reviews.route";
import { CategoriesRoutes } from "../modules/category/category.route";
import { UserRoutes } from "../modules/user/user.route";

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
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;

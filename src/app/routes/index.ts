import { Router } from 'express';
import { ReviewsRoutes } from '../modules/reviews/reviews.route';
import { CategoriesRoutes } from '../modules/category/category.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/reviews',
    route: ReviewsRoutes,
  },
  {
    path: '/categories',
    route: CategoriesRoutes,
  },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;

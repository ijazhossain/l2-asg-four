import { Router } from 'express';
import { CategoryControllers } from './category.controller';
import validateRequest from '../../middlewares/validateRequest';
import createCategoryValidationSchema from './category.validation';

const router = Router();
router.post(
  '/',
  validateRequest(createCategoryValidationSchema),
  CategoryControllers.createCategory,
);
router.get('/', CategoryControllers.getAllCatagories);
export const CategoriesRoutes = router;

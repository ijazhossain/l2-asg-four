import { Router } from 'express';
import { ReviewsControllers } from './reviews.controller';
import validateRequest from '../../middlewares/validateRequest';
import { ReviewValidations } from './reviews.validation';

const router = Router();
router.post(
  '/',
  validateRequest(ReviewValidations.createReviewValidationSchema),
  ReviewsControllers.createReviews,
);
export const ReviewsRoutes = router;

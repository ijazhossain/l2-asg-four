import { TReviews } from './reviews.interface';
import { Review } from './reviews.model';

const createReviewsIntoDB = async (payload: TReviews) => {
  const result = await Review.create(payload);
  return result;
};
export const ReviewsServices = {
  createReviewsIntoDB,
};

import { z } from 'zod';

const createReviewValidationSchema = z.object({
  courseId: z.string({
    required_error: 'Course id is required',
  }),
  rating: z.number({
    required_error: 'Course rating is required',
    invalid_type_error: 'Rating must be number type',
  }),
  review: z.string({
    required_error: 'Course rating is required',
    invalid_type_error: 'Rating must be number type',
  }),
});
export const ReviewValidations = {
  createReviewValidationSchema,
};

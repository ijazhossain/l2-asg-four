import { Schema, model } from 'mongoose';
import { TReviews } from './reviews.interface';

const reviewSchema = new Schema<TReviews>({
  courseId: {
    type: Schema.Types.ObjectId,
    required: [true, 'Course Id is required'],
    ref: 'Course',
  },
  rating: {
    type: Number,
    required: [true, 'Course Rating is required'],
  },
  review: {
    type: String,
    required: [true, 'Course Review is required'],
  },
});
export const Review = model<TReviews>('Review', reviewSchema);

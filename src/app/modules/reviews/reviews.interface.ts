import { Types } from 'mongoose';

export type TReviews = {
  courseId: Types.ObjectId;
  rating: number;
  review: string;
};

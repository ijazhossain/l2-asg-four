import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ReviewsServices } from './reviews.services';

const createReviews = catchAsync(async (req, res) => {
  const result = await ReviewsServices.createReviewsIntoDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Review is created successfully',
    data: result,
  });
});
export const ReviewsControllers = {
  createReviews,
};

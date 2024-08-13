import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TCourse } from './course.interface';
import { Course } from './course.model';
import mongoose from 'mongoose';
import { Review } from '../reviews/reviews.model';

const createCourseIntoDB = async (payload: TCourse) => {
  const result = await Course.create(payload);
  return result;
};
const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
  const { minPrice, maxPrice, tags, sortBy, sortOrder, level } = query;
  let queryObj = { ...query };
  const excludeFields = ['sortBy', 'sortOrder', 'limit', 'page'];
  excludeFields.forEach((el) => delete queryObj[el]);

  //   filterBased On max and min price
  if (maxPrice && minPrice) {
    queryObj = {
      price: { $lte: Number(maxPrice), $gte: Number(minPrice) },
      ...queryObj,
    };
    delete queryObj['maxPrice'];
    delete queryObj['minPrice'];
  }
  //   filter based on tags

  if (tags) {
    queryObj = {
      'tags.name': tags,
      ...queryObj,
    };
    delete queryObj['tags'];
  }
  // filter for levels
  if (level) {
    queryObj = {
      'details.level': level,
      ...queryObj,
    };
    delete queryObj['level'];
  }
  const filterQuery = Course.find(queryObj);
  // for sort
  let sortOptions: string = 'title';
  if (sortBy) {
    if (sortOrder === 'desc') {
      sortOptions = `-${query.sortBy}`;
    } else {
      sortOptions = query.sortBy as string;
    }
  }
  const sortQuery = filterQuery.sort(sortOptions);
  // for limit
  let page = 1;
  let limit = 1;
  let skip = 0;
  if (query?.limit) {
    limit = Number(query.limit);
  }
  if (query?.page) {
    page = Number(query.page);
    skip = (page - 1) * limit;
  }
  const paginateQuery = sortQuery.skip(skip);
  const limitQuery = await paginateQuery.limit(limit);
  return limitQuery;
};
const getSingleCourseWithReviewsFromDB = async (id: string) => {
  const course = await Course.findById(id);
  const reviews = await Review.find({ courseId: id });
  return {
    course,
    reviews,
  };
};
const updateCourseIntoDB = async (id: string, payload: Partial<TCourse>) => {
  const {
    tags,
    startDate,
    endDate,
    durationInWeeks,
    details,
    ...remainingCourseData
  } = payload;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const modifiedData: Record<string, unknown> = { ...remainingCourseData };
    const updateBasicInfo = await Course.findByIdAndUpdate(
      id,
      {
        $set: modifiedData,
      },
      {
        new: true,
        runValidators: true,
        session,
      },
    );
    if (!updateBasicInfo) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course');
    }
    // update course start, end date and durations

    if (!startDate && !endDate && durationInWeeks) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Do not update Course duration directly, update start or end date instead',
      );
    }

    if (
      (startDate && startDate.length > 0) ||
      (endDate && endDate.length > 0)
    ) {
      const previousCourseData = (await Course.findById(id)) as TCourse;

      const oneDay = 24 * 60 * 60 * 1000;
      const parsedStartDate = new Date(
        startDate ? startDate : previousCourseData?.startDate,
      );
      const parsedEndDate = new Date(
        endDate ? endDate : previousCourseData?.endDate,
      );
      const timeDifference =
        parsedEndDate.getTime() - parsedStartDate.getTime();
      const daysDifference = timeDifference / oneDay;
      const duration = Math.ceil(daysDifference / 7);
      const updateDuration = await Course.findByIdAndUpdate(
        id,
        {
          $set: {
            durationInWeeks: duration,
            startDate: startDate ? startDate : previousCourseData?.startDate,
            endDate: endDate ? endDate : previousCourseData?.endDate,
          },
        },
        {
          new: true,
          runValidators: true,
          session,
        },
      );
      if (!updateDuration) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course');
      }
    }
    // update tags fields
    if (tags && tags.length > 0) {
      const deletedTags = tags
        .filter((tag) => tag.name && tag.isDeleted)
        .map((tag) => tag.name);
      const updateDeletedTagsInCourse = await Course.findByIdAndUpdate(
        id,
        {
          $pull: { tags: { name: { $in: deletedTags } } },
        },
        {
          new: true,
          runValidators: true,
          session,
        },
      );
      if (!updateDeletedTagsInCourse) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course');
      }
      const newTags = tags?.filter((tag) => tag.name && !tag.isDeleted);
      const updateNewTagsInCourse = await Course.findByIdAndUpdate(
        id,
        {
          $addToSet: { tags: { $each: newTags } },
        },
        {
          new: true,
          runValidators: true,
          session,
        },
      );
      if (!updateNewTagsInCourse) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course');
      }
    }
    // update the details field
    if (details && Object.keys(details).length) {
      for (const [key, value] of Object.entries(details)) {
        modifiedData[`details.${key}`] = value;
      }
    }
    const updateDetailsInCourse = await Course.findByIdAndUpdate(
      id,
      { $set: modifiedData },
      {
        new: true,
        upsert: true,
        runValidators: true,
        session,
      },
    );
    if (!updateDetailsInCourse) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course');
    }
    await session.commitTransaction();
    await session.endSession();
    const result = await Course.findById(id);
    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course!!!');
  }
};
// service to get the best course
const getBestCourseFromDB = async () => {
  const result = await Review.aggregate([
    {
      $group: {
        _id: '$courseId',
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 },
      },
    },
    {
      $addFields: {
        averageRating: { $round: ['$averageRating', 2] },
      },
    },
    {
      $lookup: {
        from: 'courses',
        localField: '_id',
        foreignField: '_id',
        as: 'course',
      },
    },
    {
      $unwind: '$course',
    },
    {
      $sort: { averageRating: -1 },
    },
    {
      $limit: 1,
    },
    {
      $project: {
        'course._id': 1,
        'course.title': 1,
        'course.instructor': 1,
        'course.categoryId': 1,
        'course.price': 1,
        'course.tags': 1,
        'course.startDate': 1,
        'course.endDate': 1,
        'course.language': 1,
        'course.provider': 1,
        'course.durationInWeeks': 1,
        'course.details': 1,
        averageRating: 1,
        reviewCount: 1,
      },
    },
  ]);

  if (result.length === 0) {
    throw new AppError(httpStatus.BAD_REQUEST, 'No courses found with reviews');
  }

  const bestCourse = result[0];

  return bestCourse;
};
export const CourseServices = {
  createCourseIntoDB,
  getAllCoursesFromDB,
  getSingleCourseWithReviewsFromDB,
  updateCourseIntoDB,
  getBestCourseFromDB,
};

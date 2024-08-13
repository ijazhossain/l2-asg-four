import { Router } from 'express';
import { CourseControllers } from './course.controller';
import validateRequest from '../../middlewares/validateRequest';
import { CourseValidations } from './course.validation';

const router = Router();
router.post(
  '/course',
  validateRequest(CourseValidations.createCourseValidationSchema),
  CourseControllers.createCourse,
);
router.get('/courses', CourseControllers.getAllCourses);
router.get(
  '/courses/:courseId/reviews',
  CourseControllers.getSingleCourseWithReviews,
);
router.put(
  '/courses/:courseId',
  validateRequest(CourseValidations.updateCourseValidationSchema),
  CourseControllers.updateCourse,
);
router.get('/course/best', CourseControllers.getBestCourse);
export const CourseRoutes = router;

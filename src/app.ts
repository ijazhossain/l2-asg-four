/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { CourseRoutes } from './app/modules/course/course.route';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import { CategoriesRoutes } from './app/modules/category/category.route';
import { ReviewsRoutes } from './app/modules/reviews/reviews.route';
import router from './app/routes';
const app: Application = express();
// parser
app.use(express.json());
app.use(cors());
// course route
app.use('/api', CourseRoutes);
// app route
app.use('/api', router);
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Express server is running!',
  });
});
// global error handler
app.use(globalErrorHandler);
//For not found api
app.use(notFound);
export default app;

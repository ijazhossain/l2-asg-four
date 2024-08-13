import { Schema, model } from 'mongoose';
import { TCourse, TDetails, TTag } from './course.interface';
const tagsSchema = new Schema<TTag>(
  {
    name: {
      type: String,
      required: [true, 'Tag Name is required'],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false },
);
const detailsSchema = new Schema<TDetails>(
  {
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      required: [true, 'Course level is required'],
    },
    description: {
      type: String,
      required: [true, 'Course description is required'],
    },
  },
  { _id: false },
);
const courseSchema = new Schema<TCourse>({
  title: {
    type: String,
    unique: true,
    trim: true,
    required: [true, 'Course title is required'],
  },
  instructor: {
    type: String,
    required: [true, 'Course instructor is required'],
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    required: [true, 'Category id is required'],
    ref: 'Category',
  },

  price: {
    type: Number,
    required: [true, 'Course price is required'],
  },
  tags: {
    type: [tagsSchema],
    required: [true, 'Tags are required'],
  },
  startDate: {
    type: String,
    required: [true, 'Start Date is required'],
  },
  endDate: {
    type: String,
    required: [true, 'End Date is required'],
  },
  language: {
    type: String,
    required: [true, 'Language is required'],
  },
  provider: {
    type: String,
    required: [true, 'Provider is required'],
  },
  durationInWeeks: {
    type: Number,
    min: [1, 'Course duration must be positive.'],
  },
  details: {
    type: detailsSchema,
    required: [true, 'Course details is required'],
  },
});
courseSchema.pre('save', function (next) {
  const oneDay = 24 * 60 * 60 * 1000;
  const parsedStartDate = new Date(this.startDate);
  const parsedEndDate = new Date(this.endDate);
  const timeDifference = parsedEndDate.getTime() - parsedStartDate.getTime();
  const daysDifference = timeDifference / oneDay;
  const durationInWeeks = Math.ceil(daysDifference / 7);
  this.durationInWeeks = durationInWeeks;
  next();
});
export const Course = model<TCourse>('Course', courseSchema);

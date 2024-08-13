import { z } from 'zod';
const createTagsValidationSchema = z.object({
  name: z.string({
    required_error: 'Tag name is required',
    invalid_type_error: 'Tag name must be a string',
  }),
  isDeleted: z.boolean().optional().default(false),
});
const updateTagsValidationSchema = z.object({
  name: z.string().optional(),
  isDeleted: z.boolean().optional().default(false).optional(),
});
const createDetailsValidationSchema = z.object({
  level: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  description: z.string({
    required_error: 'Course description is required',
    invalid_type_error: 'Course description must be a string',
  }),
});
const updateDetailsValidationSchema = z.object({
  level: z.enum(['Beginner', 'Intermediate', 'Advanced']).optional(),
  description: z.string().optional(),
});
const createCourseValidationSchema = z.object({
  title: z
    .string({
      required_error: 'Course title is required',
      invalid_type_error: 'Course title must be a string',
    })
    .max(30),
  instructor: z
    .string({
      required_error: 'Course instructor is required',
      invalid_type_error: 'Course instructor must be a string',
    })
    .max(30),
  categoryId: z.string({
    required_error: 'Course categoryId is required',
    invalid_type_error: 'Course categoryId must be a string',
  }),
  /*  price: z
    .number({
      required_error: 'Course price is required',
      invalid_type_error: 'Course price must be a number',
    })
    .positive(), */
  tags: z.array(createTagsValidationSchema),
  startDate: z.string({
    required_error: 'startDate is required',
    invalid_type_error: 'startDate must be a number',
  }),
  endDate: z.string({
    required_error: 'endDate is required',
    invalid_type_error: 'endDate must be a number',
  }),
  language: z.string({
    required_error: 'endDate is required',
    invalid_type_error: 'endDate must be a number',
  }),
  provider: z.string({
    required_error: 'Course provider is required',
    invalid_type_error: 'Course provider must be a string',
  }),
  durationInWeeks: z
    .number({
      invalid_type_error: 'Course provider must be a number',
    })
    .positive()
    .optional(),
  details: createDetailsValidationSchema,
});
const updateCourseValidationSchema = z.object({
  title: z.string().max(30).optional(),

  instructor: z.string().max(30).optional(),
  categoryId: z.string().optional(),
  price: z.number().positive().optional(),
  tags: z.array(updateTagsValidationSchema).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  language: z.string().optional(),
  provider: z.string().optional(),
  durationInWeeks: z.number().positive().optional(),
  details: updateDetailsValidationSchema.optional(),
});
export const CourseValidations = {
  createCourseValidationSchema,
  updateCourseValidationSchema,
};

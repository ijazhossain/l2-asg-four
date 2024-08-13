import { z } from 'zod';

export const createCategoryValidationSchema = z.object({
  name: z.string({
    required_error: 'Category name is required',
    invalid_type_error: 'Category name must be a string value',
  }),
});
export default createCategoryValidationSchema;

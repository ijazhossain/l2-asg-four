import { TCategory } from './category.interface';
import { Category } from './category.model';

const createCategoryIntoDB = async (payload: TCategory) => {
  const result = await Category.create(payload);
  return result;
};
const getAllCategories = async () => {
  const result = await Category.find();
  return result;
};
export const CategoryServices = {
  createCategoryIntoDB,
  getAllCategories,
};

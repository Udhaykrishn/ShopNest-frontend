import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import { z } from 'zod';
import { Category } from '@/types';

const CategorySchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, 'Category name is required').trim()
    .refine(val => val.length > 0, 'Category name cannot be just spaces'),
  isBlocked: z.boolean().optional(),
  subCategory: z.array(z.string().min(1, 'Subcategory cannot be empty').trim()
    .refine(val => val.length > 0, 'Subcategory cannot be just spaces')).optional(),
  data: z.any().optional(),
});

const SubCategorySchema = z.string()
  .min(1, 'Subcategory cannot be empty')
  .trim()
  .refine(val => val.length > 0, 'Subcategory cannot be just spaces');

interface CategoryFormProps {
  category?: Category;
  onSubmit: (data: Category) => void;
  isLoading: boolean;
  onCancel: () => void;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  category,
  onSubmit,
  isLoading,
  onCancel
}) => {
  const [formData, setFormData] = useState<Category>({
    _id: category?._id as string,
    name: category?.name || '',
    isBlocked: category?.isBlocked as boolean,
    offer:category?.offer as number,
    subCategory: category?.subCategory || [],
  });

  const [newSubCategory, setNewSubCategory] = useState('');
  const [errors, setErrors] = useState<{
    name?: string;
    subCategory?: string;
    form?: string;
  }>({});

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData({ ...formData, name });

    const result = CategorySchema.safeParse({ ...formData, name });
    if (!result.success) {
      const nameError = result.error.errors.find(err => err.path.includes('name'))?.message;
      setErrors({ ...errors, name: nameError });
    } else {
      setErrors({ ...errors, name: undefined });
    }
  };

  const handleAddSubCategory = () => {
    const result = SubCategorySchema.safeParse(newSubCategory);
    if (!result.success) {
      setErrors({ ...errors, subCategory: result.error.errors[0].message });
      return;
    }

    const trimmedSubCategory = newSubCategory.trim();
    if (formData.subCategory.includes(trimmedSubCategory)) {
      setErrors({ ...errors, subCategory: 'This subcategory already exists' });
      return;
    }

    setFormData({
      ...formData,
      subCategory: [...formData.subCategory, trimmedSubCategory]
    });
    setNewSubCategory('');
    setErrors({ ...errors, subCategory: undefined });
  };

  const handleRemoveSubCategory = (index: number) => {
    const updatedSubCategories = [...formData.subCategory];
    updatedSubCategories.splice(index, 1);
    setFormData({ ...formData, subCategory: updatedSubCategories });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSubCategory();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = CategorySchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: { name?: string; subCategory?: string } = {};
      result.error.errors.forEach(err => {
        if (err.path.includes('name')) {
          fieldErrors.name = err.message;
        } else if (err.path.includes('subCategory')) {
          fieldErrors.subCategory = err.message;
        }
      });
      setErrors({ ...fieldErrors, form: 'Please fix the errors before submitting' });
      return;
    }

    setErrors({});
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="category-name">Category Name</Label>
        <Input
          id="category-name"
          value={formData.name}
          onChange={handleNameChange}
          placeholder="Enter category name"
          required
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Subcategories</Label>
        <div className="flex gap-2">
          <Input
            value={newSubCategory}
            onChange={(e) => setNewSubCategory(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add new subcategory"
            className={errors.subCategory ? 'border-red-500' : ''}
          />
          <Button
            type="button"
            onClick={handleAddSubCategory}
            variant="outline"
            size="icon"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {errors.subCategory && (
          <p className="text-sm text-red-500">{errors.subCategory}</p>
        )}

        <div className="mt-2">
          {formData.subCategory.length === 0 ? (
            <p className="text-sm text-gray-500">No subcategories added yet</p>
          ) : (
            <ul className="space-y-2">
              {formData.subCategory.map((subCategory, index) => (
                <li key={index} className="flex items-center justify-between p-2 rounded">
                  <span>{subCategory}</span>
                  <Button
                    type="button"
                    onClick={() => handleRemoveSubCategory(index)}
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-gray-500 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {errors.form && (
        <p className="text-sm text-red-500">{errors.form}</p>
      )}

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : category ? 'Update Category' : 'Create Category'}
        </Button>
      </div>
    </form>
  );
};
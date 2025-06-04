import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Category } from '@/types';
import { useCategoryMutations } from '@/hooks';
import { CategoryForm } from './category-form';

interface CategoryFormModalProps {
    show: boolean;
    onClose: () => void;
    category: Category | null;
}

export const CategoryFormModal: React.FC<CategoryFormModalProps> = ({
    show,
    onClose,
    category
}) => {
    const { createCategory, updateCategory } = useCategoryMutations()

    const isLoading = createCategory.isPending || updateCategory.isPending;

    const handleSubmit = (data: Category) => {
        if (category) {
            updateCategory.mutate({
                id: category._id,
                category: data,
                subCategory: data.subCategory
            }, {
                onSuccess: () => onClose()
            });
        } else {
            createCategory.mutate({ category: data, subCategory: data.subCategory }, {
                onSuccess: () => onClose()
            });
        }
    };

    return (
        <Dialog open={show} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {category ? "Edit Category" : "Add New Category"}
                    </DialogTitle>
                </DialogHeader>
                {show && (
                    <CategoryForm
                        category={category || undefined}
                        onSubmit={handleSubmit}
                        isLoading={isLoading}
                        onCancel={onClose}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
};
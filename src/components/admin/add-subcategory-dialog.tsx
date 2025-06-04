import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Category,NewSubcategory  } from '@/types';

interface AddSubcategoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    categories: Category[];
    value: NewSubcategory;
    onChange: (value: NewSubcategory) => void;
    onSave: () => void;
    isLoading: boolean;
}

export const AddSubcategoryDialog: React.FC<AddSubcategoryDialogProps> = ({
    open,
    onOpenChange,
    categories,
    value,
    onChange,
    onSave,
    isLoading
}) => (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Add New Subcategory</DialogTitle>
                <DialogDescription>Enter the details for the new subcategory</DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Select Parent Category</label>
                    <select
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2"
                        value={value.categoryId?.toString() || ""}
                        onChange={(e) => onChange({ ...value, categoryId: e.target.value ? parseInt(e.target.value) : null })}
                        disabled={isLoading}
                    >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                            <option key={category._id} value={category._id}>
                                {category.name} ({category.name})
                            </option>
                        ))}
                    </select>
                </div>
                <Input
                    placeholder="Subcategory Name"
                    value={value.name}
                    onChange={(e) => onChange({ ...value, name: e.target.value })}
                    disabled={isLoading}
                />
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>Cancel</Button>
                <Button onClick={onSave} disabled={isLoading}>
                    {isLoading ? "Adding..." : "Add Subcategory"}
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
);


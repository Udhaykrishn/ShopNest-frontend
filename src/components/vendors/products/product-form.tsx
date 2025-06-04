import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Product } from '@/types/shop-product';
import { useProductMutations } from '@/hooks';

interface ProductFormProps {
    initialData: Product;
    onSubmit: (productData: Partial<Product>) => void;
    submitButtonText: string;
}

export const ProductForm = ({ initialData }: ProductFormProps) => {
    const [formData, setFormData] = useState<Partial<Product>>(initialData);

    const { updateProduct } = useProductMutations()

    const handleEditProduct = (productId: string, data: any) => {
        updateProduct.mutate({ productId, productData: data })
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleEditProduct(formData._id as string, formData)
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium">Name</label>
                <Input
                    id="name"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleChange}
                    placeholder="Product Name"
                />
            </div>
            <div>
                <label htmlFor="brand" className="block text-sm font-medium">Brand</label>
                <Input
                    id="brand"
                    name="brand"
                    value={formData.brand || ''}
                    onChange={handleChange}
                    placeholder="Brand"
                />
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium">Description</label>
                <Input
                    id="description"
                    name="description"
                    value={formData.description || ''}
                    onChange={handleChange}
                    placeholder="Description"
                />
            </div>
            <div>
                <label htmlFor="category" className="block text-sm font-medium">Category</label>
                <Input
                    id="category"
                    name="category"
                    value={formData.category as string || ''}
                    onChange={handleChange}
                    placeholder="Category"
                />
            </div>
            <div>
                <label htmlFor="subcategory" className="block text-sm font-medium">Subcategory</label>
                <Input
                    id="subcategory"
                    name="subcategory"
                    value={formData.subcategory || ''}
                    onChange={handleChange}
                    placeholder="Subcategory"
                />
            </div>
            {/* Add fields for variants if needed */}
            <Button type="submit">Update Product</Button>
        </form>
    );
};

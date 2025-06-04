import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { ProductForm } from './product-form';
import { Product } from '@/types/shop-product';

interface EditProductModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (productData: Partial<Product>) => void;
}

export const EditProductModal = ({
    product,
    isOpen,
    onClose,
    onSave,
}: EditProductModalProps) => {
    if (!product) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Edit Product</DialogTitle>
                </DialogHeader>
                <ProductForm
                    initialData={product}
                    onSubmit={onSave}
                    submitButtonText="Save Changes"
                />
            </DialogContent>
        </Dialog>
    );
};
import { ProductCard } from './product-card';
import { useProductMutations, useProducts } from '@/hooks/useProducts';
import { Package, Home, ChevronRight, PackageX } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useVendorAuthStore } from '@/stores/vendor/vendorAuthStore';
import { Product } from '@/types/shop-product';

const ProductCardSkeleton = () => (
    <div className="rounded-lg border overflow-hidden">
        <Skeleton className="h-48 w-full" />
        <div className="p-4 space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex justify-between mt-4">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-24" />
            </div>
        </div>
    </div>
);

const EmptyState = () => (
    <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed rounded-lg">
        <PackageX className="w-16 h-16 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900">No Products Found</h3>
        <p className="text-gray-500 mt-2">
            There are no products available at the moment. Add your first product to get started.
        </p>
    </div>
);

export const ProductsTab = () => {
    const { blockProduct, unblockProduct } = useProductMutations();

    const { vendor } = useVendorAuthStore();
    const { data, isSuccess, isLoading } = useProducts(vendor?.id as string);

    let products: Product[] = [];
    if (isSuccess && data) {
        products = data.data || data.products || [];
    }


    const handleToggleBlock = async (product: Product) => {
        if (product.isBlocked === undefined) return;
        try {
            if (product.isBlocked) {
                await unblockProduct.mutateAsync(product._id);
            } else {
                await blockProduct.mutateAsync(product._id);
            }
        } catch (error) {
            console.error('Failed to toggle block status:', error);
        }
    };

    const breadcrumbItems = [
        { label: 'Home', icon: <Home className="h-4 w-4" />, href: '/' },
        { label: 'Products', icon: <Package className="h-4 w-4" />, href: '/products' },
    ];

    if (isLoading) {
        return (
            <>
                <Breadcrumb items={breadcrumbItems} separator={<ChevronRight className="h-4 w-4" />} />
                <div className="pt-5 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, index) => (
                            <ProductCardSkeleton key={index} />
                        ))}
                    </div>
                </div>
            </>
        );
    }

    if (!products || products.length === 0) {
        return (
            <div className="space-y-6">
                <Breadcrumb items={breadcrumbItems} separator={<ChevronRight className="h-4 w-4" />} />
                <EmptyState />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Breadcrumb items={breadcrumbItems} separator={<ChevronRight className="h-4 w-4" />} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                    <ProductCard
                        key={product._id}
                        product={product}
                        onToggleBlock={product.isBlocked !== undefined ? () => handleToggleBlock(product) : undefined}
                    />
                ))}
            </div>
        </div>
    );
};

interface BreadcrumbItem {
    label: string;
    icon?: React.ReactNode;
    href: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
    separator: React.ReactNode;
}

const Breadcrumb = ({ items, separator }: BreadcrumbProps) => (
    <nav className="flex items-center space-x-2 text-sm text-gray-500">
        {items.map((item, index) => (
            <div key={item.href} className="flex items-center">
                {index > 0 && <span className="mx-2">{separator}</span>}
                <a
                    href={item.href}
                    className="flex items-center hover:text-gray-900 transition-colors"
                >
                    {item.icon && <span className="mr-1.5">{item.icon}</span>}
                    {item.label}
                </a>
            </div>
        ))}
    </nav>
);
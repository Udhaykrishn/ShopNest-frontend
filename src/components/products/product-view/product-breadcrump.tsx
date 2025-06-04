import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { ChevronRight, Home } from 'lucide-react'
import { Product } from './view-product';

export const ProductBreadcrumb = ({ product }: { product: Product }) => {
    return (
        <div>
            <Breadcrumb className="mb-6">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/" className="dark:text-gray-300 hover:text-primary">
                            <Home className="h-4 w-4" />
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator>
                        <ChevronRight className="h-4 w-4 dark:text-gray-400" />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/shop" className="dark:text-gray-300 hover:text-primary">Shop</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator>
                        <ChevronRight className="h-4 w-4 dark:text-gray-400" />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                        <BreadcrumbLink href={`/shop/`} className="dark:text-gray-300 hover:text-primary">
                            {product.category}
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator>
                        <ChevronRight className="h-4 w-4 dark:text-gray-400" />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                        <BreadcrumbLink href={`/shop/`} className="dark:text-gray-300 hover:text-primary">
                            {product.subcategory}
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    )
}


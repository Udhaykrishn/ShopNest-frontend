import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductsTab } from './product-tab';
import { ProductForm } from './products';
export const ProductManagement = () => {
    return (
        <div className="container mx-auto py-6">
            <Tabs defaultValue="products" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="products">Products</TabsTrigger>
                    <TabsTrigger value="add-product">Add Product</TabsTrigger>
                </TabsList>

                <TabsContent value="products">
                    <ProductsTab />
                </TabsContent>

                <TabsContent value="add-product">
                    <ProductForm />
                </TabsContent>

            </Tabs>
        </div>
    );
};

export default ProductManagement;
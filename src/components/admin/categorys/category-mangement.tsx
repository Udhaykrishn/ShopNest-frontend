import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search, LayoutGrid } from "lucide-react";
import { Category } from '@/types';
import { useCategories } from '@/hooks';
import { CategoriesTable } from './category-table';
import { CategoryFormModal } from './category-form-modal';
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CategoryManagement() {
    const [activeTab, setActiveTab] = useState("categories");
    const [searchQuery, setSearchQuery] = useState("");

    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [currentCategory, setCurrentCategory] = useState<Category | null>(null);

    const { data: categories = [], isLoading } = useCategories();

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddCategory = () => {
        setCurrentCategory(null);
        setShowCategoryModal(true);
    };

    const handleEditCategory = (category: Category) => {
        setCurrentCategory(category);
        setShowCategoryModal(true);
    };

    return (
        <div className="container mx-auto py-6 space-y-6">
            <Card>
                <CardHeader className="border-b">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <LayoutGrid className="h-6 w-6 text-primary" />
                            <CardTitle>Category Management</CardTitle>
                        </div>
                        <Button
                            onClick={handleAddCategory}
                            className="flex items-center gap-2"
                        >
                            <PlusCircle className="h-4 w-4" />
                            Add {"Category"}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <Tabs
                        defaultValue="categories"
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className="w-full"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <TabsList>
                                <TabsTrigger value="categories">Categories</TabsTrigger>
                                <TabsTrigger value="subcategories">Subcategories</TabsTrigger>
                            </TabsList>
                            <div className="relative w-64">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search..."
                                    className="pl-8"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        <TabsContent value="categories" className="mt-0">
                            <CategoriesTable
                                categories={filteredCategories}
                                onEdit={handleEditCategory}
                                isLoading={isLoading}
                            />
                        </TabsContent>

                        <TabsContent value="subcategories" className="mt-0">
                            {/* SubcategoriesTable component here */}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            <CategoryFormModal
                show={showCategoryModal}
                onClose={() => setShowCategoryModal(false)}
                category={currentCategory}
            />
        </div>
    );
}
import { Button } from "../ui/button";
import { Book, Dumbbell, HomeIcon, Laptop, Layers, Shirt, Smartphone } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select";

export interface Category {
    _id?: string;
    name: string;
    subcategory?: string[];
}

interface CategoriesSidebarProps {
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
    categories: Category[];
}

interface CategoryBarProps {
    onCategoryChange: (category: string) => void;
    categories: Category[];
    selectedCategory: string;
}

const categoryIcons: Record<string, JSX.Element> = {
    "All Categories": <Layers className="h-4 w-4 mr-2" />,
    "Laptops": <Laptop className="h-4 w-4 mr-2" />,
    "Smartphones": <Smartphone className="h-4 w-4 mr-2" />,
    "Clothing": <Shirt className="h-4 w-4 mr-2" />,
    "Home & Kitchen": <HomeIcon className="h-4 w-4 mr-2" />,
    "Sports": <Dumbbell className="h-4 w-4 mr-2" />,
    "Books": <Book className="h-4 w-4 mr-2" />,
};

export const CategoriesSidebar: React.FC<CategoriesSidebarProps> = ({ selectedCategory, onCategoryChange, categories }) => {
    const handleCategoryClick = (category: string) => {
        onCategoryChange(category);
    };

    return (
        <div className="w-64 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">Categories</h3>
            <ul className="space-y-2">
                {categories.length > 0 ? (
                    categories.map((category) => (
                        <li key={category._id || category.name}>
                            <Button
                                variant={selectedCategory === category.name ? "default" : "ghost"}
                                className={`w-full text-left justify-start ${selectedCategory === category.name
                                        ? "bg-primary text-white"
                                        : "dark:text-gray-300 hover:bg-gray-700 hover:text-white"
                                    }`}
                                onClick={() => handleCategoryClick(category.name)}
                            >
                                {categoryIcons[category.name] || <Layers className="h-4 w-4 mr-2" />}
                                {category.name || "Unnamed Category"}
                            </Button>
                            {category.subcategory && category.subcategory.length > 0 && (
                                <div className="ml-4 mt-2">
                                    <Select
                                        value={selectedCategory && category.subcategory.includes(selectedCategory) ? selectedCategory : ""}
                                        onValueChange={(value) => handleCategoryClick(value)}
                                    >
                                        <SelectTrigger className="w-full dark:text-gray-300">
                                            <SelectValue placeholder="Select Subcategory" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {category.subcategory.map((sub) => (
                                                <SelectItem key={sub} value={sub}>
                                                    {sub || "Unnamed Subcategory"}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </li>
                    ))
                ) : (
                    <p className="dark:text-gray-300">No categories available</p>
                )}
            </ul>
        </div>
    );
};

export const CategoryBar: React.FC<CategoryBarProps> = ({ onCategoryChange, categories, selectedCategory }) => {
    const handleCategoryClick = (category: string) => {
        onCategoryChange(category);
    };

    return (
        <div className="container py-4 overflow-x-auto whitespace-nowrap border-b dark:border-gray-700">
            {categories.map((category) => (
                <Button
                    key={category._id || category.name}
                    variant={selectedCategory === category.name ? "default" : "ghost"}
                    className={`inline-flex items-center mx-2 ${selectedCategory === category.name
                            ? "bg-primary text-white"
                            : "dark:text-gray-300 dark:hover:bg-gray-700"
                        }`}
                    onClick={() => handleCategoryClick(category.name)}
                >
                    {categoryIcons[category.name] || <Layers className="h-4 w-4 mr-2" />}
                    <span>{category.name || "Unnamed Category"}</span>
                </Button>
            ))}
        </div>
    );
};
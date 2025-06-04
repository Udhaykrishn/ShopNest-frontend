import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORIES } from "@/constants/shop";

interface SearchAndFilterProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
    sortBy: string;
    onSortChange: (value: string) => void;
}

export const SearchAndFilter = ({
    searchQuery,
    onSearchChange,
    selectedCategory,
    onCategoryChange,
    sortBy,
    onSortChange,
}: SearchAndFilterProps) => {
    return (
        <div className="mb-12">
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                    <Select value={sortBy} onValueChange={onSortChange}>
                        <SelectTrigger className="w-[180px] bg-primary text-white">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="default">Default</SelectItem>
                            <SelectItem value="price-low">Price: Low to High</SelectItem>
                            <SelectItem value="price-high">Price: High to Low</SelectItem>
                            <SelectItem value="name-asc">Name: A to Z</SelectItem>
                            <SelectItem value="name-desc">Name: Z to A</SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="flex gap-2 flex-wrap">
                        {CATEGORIES.map((category) => (
                            <Button
                                key={category}
                                variant={selectedCategory === category ? "default" : "outline"}
                                onClick={() => onCategoryChange(category)}
                            >
                                {category}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
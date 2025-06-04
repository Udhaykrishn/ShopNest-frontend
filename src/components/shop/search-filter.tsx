import { Category } from "@/types";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; 

export type SortOption = "price-asc" | "price-desc" | "newest" | "";

interface SearchAndFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  categories: Category[];
}

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  categories,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <Input
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full md:w-1/3"
      />
      <Select value={selectedCategory} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-full md:w-1/4">
          <SelectValue placeholder="Select Category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <div key={category._id || category.name}>
              <SelectItem value={category.name}>
                {category.name || "Unnamed Category"}
              </SelectItem>
              {category.subCategory &&
                category.subCategory.length > 0 &&
                category.subCategory.map((sub) => (
                  <SelectItem key={sub} value={sub} className="pl-6">
                    - {sub || "Unnamed Subcategory"}
                  </SelectItem>
                ))}
            </div>
          ))}
        </SelectContent>
      </Select>
      <Select value={sortBy} onValueChange={(value) => onSortChange(value as SortOption)}>
        <SelectTrigger className="w-full md:w-1/4">
          <SelectValue placeholder="Sort By" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="price-asc">Price: Low to High</SelectItem>
          <SelectItem value="price-desc">Price: High to Low</SelectItem>
          <SelectItem value="newest">Newest First</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
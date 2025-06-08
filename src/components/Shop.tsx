import { useEffect, useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { ProductCard } from "@/components/products/";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { ChevronRight, Home, X } from "lucide-react";
import { useShopStore } from '@/stores/shop-store';
import { useDebounce } from 'use-debounce';
import { useAllCategories } from '@/hooks';
import { api, Product } from '@/types';
import { CategoriesSidebar } from './shop/category-sidebar';
import { SearchAndFilter, SortOption } from './shop/search-filter';
import { ProductSkeleton } from './shop/product-loader';

const fetchProducts = async (category: string): Promise<Product[]> => {
  const endpoint =
    category === "All Categories"
      ? 'https://shopnest.zapto.org/api/products?status=approved'
      : `https://shopnest.zapto.org/api/products/category?category=${category}`;
  const response = await api.get(endpoint);
  console.log(response.data.data.data);
  return response.data.data.data;
};

export const ShopPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearch] = useDebounce<string>(searchQuery, 500);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const itemsPerPage: number = 9;

  const {
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
  } = useShopStore();

  const { data: categoriesData, isLoading: categoryLoading, error: categoryError } = useAllCategories();

  const categories: any[] = categoriesData?.data
    ? [{ name: "All Categories" }, ...categoriesData.data]
    : [{ name: "All Categories" }];

  const { data: fetchedProducts = [], isLoading: isLoadingProducts, error: errorProducts } = useQuery({
    queryKey: ['products', selectedCategory],
    queryFn: () => fetchProducts(selectedCategory || "All Categories"),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (!selectedCategory) {
      setSelectedCategory("All Categories");
    }
    if (!sortBy) {
      setSortBy("newest");
    }
    setCurrentPage(1);
  }, [selectedCategory, setSelectedCategory, setSortBy, sortBy]);

  const filteredProducts: Product[] = fetchedProducts.filter((product) => {
    const matchesSearch = debouncedSearch === "" ||
      product.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      product.description.toLowerCase().includes(debouncedSearch.toLowerCase());
    return matchesSearch;
  });

  const sortedProducts: Product[] = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return (a.variants[0]?.values[0]?.price || 0) - (b.variants[0]?.values[0]?.price || 0);
      case "price-desc":
        return (b.variants[0]?.values[0]?.price || 0) - (a.variants[0]?.values[0]?.price || 0);
      case "newest":
        return new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime();
      default:
        return 0;
    }
  });

  const totalItems: number = sortedProducts.length;
  const totalPages: number = Math.ceil(totalItems / itemsPerPage);
  const paginatedProducts: Product[] = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number): void => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  if (categoryLoading || isLoadingProducts) return (
    <div className="container py-6 sm:py-8 lg:py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {[...Array(itemsPerPage)].map((_, index) => (
          <ProductSkeleton key={index} />
        ))}
      </div>
    </div>
  );
  if (categoryError) return <div className="text-center py-12 text-destructive dark:text-red-400">Error loading categories: {categoryError.message}</div>;
  if (errorProducts) return <div className="text-center py-12 text-destructive dark:text-red-400">Error loading products: {(errorProducts as any).message}</div>;

  return (
    <div className="min-h-screen bg-background overflow-x-hidden w-full dark:text-gray-100">
      <section className="container py-6 sm:py-8 lg:py-12">
        <Breadcrumb className="mb-4 sm:mb-6">
          <BreadcrumbList className="flex-wrap text-sm sm:text-base">
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="dark:text-gray-300">
                <Home className="h-3 w-3 sm:h-4 sm:w-4" />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 dark:text-gray-400" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink href="/shop" className="dark:text-gray-300">Shop</BreadcrumbLink>
            </BreadcrumbItem>
            {selectedCategory && selectedCategory !== "All Categories" && (
              <>
                <BreadcrumbSeparator>
                  <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 dark:text-gray-400" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage className="dark:text-gray-100">{selectedCategory}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
          <Button
            className="sm:hidden mb-4 w-full"
            onClick={() => setIsSidebarOpen(true)}
          >
            Filter by Category
          </Button>

          <div className="hidden sm:block w-64 flex-shrink-0">
            <CategoriesSidebar
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              categories={categories}
            />
          </div>

          {isSidebarOpen && (
            <div className="fixed inset-0 z-50 bg-black/50 sm:hidden">
              <div className="fixed left-0 top-0 h-full w-64 bg-background p-4">
                <Button
                  variant="ghost"
                  className="mb-4"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
                <CategoriesSidebar
                  selectedCategory={selectedCategory}
                  onCategoryChange={(category) => {
                    handleCategoryChange(category);
                    setIsSidebarOpen(false);
                  }}
                  categories={categories}
                />
              </div>
            </div>
          )}

          <div className="flex-1">
            <SearchAndFilter
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              sortBy={sortBy as SortOption}
              onSortChange={setSortBy}
              categories={categories}
            />

            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 lg:mb-8 dark:text-white">
                {selectedCategory && selectedCategory !== "All Categories" ? `${selectedCategory} Products` : "Featured Products"}
              </h2>
              {paginatedProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              ) : (
                <p className="text-center dark:text-gray-300">No products found.</p>
              )}
            </div>

            {totalPages > 1 && (
              <div className="mt-6 sm:mt-8 flex justify-center">
                <Pagination>
                  <PaginationContent className="flex-wrap gap-1 sm:gap-2">
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => handlePageChange(currentPage - 1)}
                        aria-disabled={currentPage === 1}
                        className={`text-sm sm:text-base dark:text-gray-300 dark:hover:bg-gray-700 ${currentPage === 1 ? "opacity-50 pointer-events-none" : ""}`}
                      />
                    </PaginationItem>
                    {[...Array(totalPages)].map((_, index) => {
                      const page = index + 1;
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => handlePageChange(page)}
                              isActive={currentPage === page}
                              className="text-sm sm:text-base w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      } else if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      ) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationEllipsis className="text-sm sm:text-base dark:text-gray-400" />
                          </PaginationItem>
                        );
                      }
                      return null;
                    })}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => handlePageChange(currentPage + 1)}
                        aria-disabled={currentPage === totalPages}
                        className={`text-sm sm:text-base dark:text-gray-300 dark:hover:bg-gray-700 ${currentPage === totalPages ? "opacity-50 pointer-events-none" : ""}`}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ShopPage;
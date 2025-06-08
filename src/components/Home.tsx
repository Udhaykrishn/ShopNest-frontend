import { useState } from "react";
import { useAllProducts } from "@/hooks/useAllProducts";
import { Button } from "./ui/button";
import {
  ShoppingBag,
  Tag,
  Timer,
  TrendingUp,
  PackageX,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import HeroCards from "./HeroCards";
import { ProductCard, ProductCarousel } from "./products";
import { Skeleton } from "./ui/skeleton";
import { PromoBanner } from "./shop/promo-banner";
import { FAQ } from "./FAQ";
import { Footer } from "./Footer";
import CookieConsent from "./cookie-page";

export function HomePage() {
  const [page, setPage] = useState(1);
  const limit = 8;

  const { data: products, isLoading, isError, isSuccess } = useAllProducts("status=approved&isBlocked=false");

  const normalizedProducts = isSuccess && Array.isArray(products?.data)
    ? products.data.map((product) => ({
      ...product,
      category: typeof product.category === 'string'
        ? product.category
        : (product.category?.name || "Uncategorized"),
      subcategory: product?.subCategory ?? product?.subcategory ?? "N/A",
      variants: Array.isArray(product?.variants) ? product.variants : [],
    }))
    : [];

  const paginatedProducts = normalizedProducts.slice((page - 1) * limit, page * limit);

  const totalProducts = normalizedProducts.length;
  const totalPages = Math.ceil(totalProducts / limit) || 1;

  return (
    <>
      <div className="min-h-screen bg-background">
        <section className="container grid lg:grid-cols-2 place-items-center py-20 md:py-32 gap-10">
          <div className="text-center lg:text-start space-y-6">
            <main className="text-5xl md:text-6xl font-bold">
              <h1 className="inline">
                <span className="inline text-primary">ShopNest</span>{" "}
              </h1>
              <h2 className="inline">
                Your Ultimate{" "}
                <span className="inline text-primary">Shopping</span>{" "}
                Destination
              </h2>
            </main>
            <p className="text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0">
              Discover an amazing collection of products with great deals and
              lightning-fast delivery. Your perfect shopping experience starts here.
            </p>
            <div className="space-y-4 md:space-y-0 md:space-x-4">
              <Button className="w-full md:w-1/3">
                Go To Shop
                <ShoppingBag className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="z-10">

            <HeroCards />
          </div>
        </section>

        <section className="container py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 dark:text-white">
              Welcome to <span className="text-primary">ShopNest</span>
            </h1>
            <p className="text-muted-foreground text-xl mb-8 dark:text-gray-400">
              Discover amazing products at great prices
            </p>
          </div>

          <PromoBanner />

          <div className="z-10">
            <ProductCarousel />
          </div>
        </section>

        {/* Products Section */}
        <section className="container py-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-bold mb-2 text-primary">Featured Products</h2>
              <p className="text-muted-foreground">Discover our selection of premium products</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">
                <TrendingUp className="mr-2 h-4 w-4" />
                Trending
              </Button>
              <Button variant="outline" size="sm">
                <Timer className="mr-2 h-4 w-4" />
                New Arrivals
              </Button>
              <Button variant="outline" size="sm">
                <Tag className="mr-2 h-4 w-4" />
                Best Deals
              </Button>
            </div>
          </div>

          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(limit)].map((_, index) => (
                <div key={index} className="space-y-3">
                  <Skeleton className="h-48 w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          )}

          {isError && (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-500 text-lg font-medium">Failed to load products</p>
              <p className="text-muted-foreground">Please try again later</p>
            </div>
          )}

          {isSuccess && (
            <>
              {paginatedProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {paginatedProducts.map((product, index) => {
                    console.log(`Rendering Product ${index}:`, product);
                    return <ProductCard key={product?._id ?? `product-${index}`} product={product} />;
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <PackageX className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg font-medium">No products available</p>
                  <p className="text-muted-foreground">Check back later for new items!</p>
                </div>
              )}

              {/* Pagination Controls */}
              {totalProducts > 0 && (
                <div className="flex justify-center items-center gap-4 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage((prev) => prev - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === totalPages}
                    onClick={() => setPage((prev) => prev + 1)}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </section>
        <section className="container py-16">
          <FAQ />
          <Footer />
        </section>
      </div>
      <CookieConsent />
    </>
  );
}
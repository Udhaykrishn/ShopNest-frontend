import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLoaderData, useNavigate } from "@tanstack/react-router";
import {
  Badge,
  ChevronLeft,
  ChevronRight,
  Heart,
  Package,
  PackageX,
  Share2,
  Shield,
  ShoppingBag,
  Truck,
} from "lucide-react";
import PriceFormat from "@/components/commerce-ui/price-format-sale"
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCategories, useProductMutations, useToast } from "@/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductImageCarousel } from "./product-carousel";
import { ProductBreadcrumb } from "./product-breadcrump";
import { api } from "@/types";
import { useAuthStore } from "@/stores/user/userAuthStore";
import { useCartMutation } from "@/hooks/cart/useCart";
import { useCartStore } from "@/stores/cart/useCartStore";
import { ToastAction } from "@/components/ui/toast"
import { useWishlistMutation } from "@/hooks/wishlist";

type VariantValue = {
  value: string;
  price: number;
  offeredPrice: number;
  stock: number;
  sku: string;
  _id: string;
};

type Variant = {
  _id: string;
  type: string;
  values: VariantValue[];
  productId: string;
};

export type Product = {
  _id: string;
  name: string;
  description: string;
  brand: string;
  category: string;
  subcategory: string;
  images: string[];
  variants: Variant[];
  vendorId: string;
  isApproved: boolean;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
};

const fetchRelatedProducts = async (category: string, subcategory: string): Promise<Product[]> => {
  const { data } = await api.get(`https://shopnest.zapto.org/api/products/category?category=${category}&subcategory=${subcategory}`);
  if (!data) {
    throw new Error("Failed to fetch related products");
  }
  return data.data.data;
};

export const SingleProductPage: React.FC = () => {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, VariantValue | null>>({});
  const [showCopyMessage, setShowCopyMessage] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useAuthStore();
  const { addToCart } = useCartMutation();
  const { cartList } = useCartStore();
  const { stockCheck } = useProductMutations();
  const { addToWishlist } = useWishlistMutation()
  const { data } = useCategories()


  const products = useLoaderData({ from: "/_authenticated/products/$id" });
  const product: Product = products.data;

  const { data: relatedProducts, isLoading } = useQuery({
    queryKey: ["relatedProducts", product.category, product.subcategory],
    queryFn: () => fetchRelatedProducts(product.category, product.subcategory),
  });

  useEffect(() => {
    if (product.variants.length > 0) {
      const initialVariants: Record<string, VariantValue | null> = {};
      product.variants.forEach((variant) => {
        initialVariants[variant.type.toLowerCase()] = variant.values[0] || null;
      });
      setSelectedVariants(initialVariants);
    }
  }, [product]);

  const handleError = (error: any, action: string) => {
    const errorMessage = error?.response?.data?.message || error?.message || "Something went wrong";
    toast({
      title: `Error in ${action}`,
      description: errorMessage,
      variant: "default",
    });
    navigate({ to: "/products/$id", params: { id: product._id } });
  };

  const handleAddStock = (productId: string, sku: string, quantity: number) => {
    const payload = { sku, productId, quantity, action: "add" };
    stockCheck.mutate(payload, {
      onSuccess: (data) => {
        setQuantity(data.data);
      },
      onError: (error) => handleError(error, "Stock Updating"),
    });
  };

  const handleReduceStock = (productId: string, sku: string, quantity: number) => {
    const payload = { sku, productId, quantity, action: "reduce" };
    stockCheck.mutate(payload, {
      onSuccess: (data) => {
        setQuantity(data.data);
      },
      onError: (error) => handleError(error, "Stock Updating"),
    });
  };

  const handleAddtoCart = (id: string, productId: string, sku: string, quantity: number) => {
    const payload = {
      id,
      productId,
      sku,
      quantity,
    };
    addToCart.mutate(payload);
  };

  const filteredCategory = data?.find((data) => data.name === product.category)

  const currentVariant = Object.values(selectedVariants)[0];
  const regularPrice = currentVariant?.price || 0;
  const offeredPrice = Math.max(currentVariant?.offeredPrice as number || 0, filteredCategory?.offer as number || 0)
  const offerPercentage = regularPrice > offeredPrice ? Math.round(((regularPrice - offeredPrice) / regularPrice) * 100) : 0;
  const stock = currentVariant?.stock ?? 0;
  const sku = currentVariant?.sku || '';

  const isInCart = cartList.some((item) => item.product.name === sku);

  const handleShareClick = async () => {
    try {
      const currentUrl = window.location.href;
      await navigator.clipboard.writeText(currentUrl);
      setShowCopyMessage(true);
      setTimeout(() => setShowCopyMessage(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast({
        title: "Failed to copy URL to clipboard",
        description: "Failed to copy URL to clipboard",
        variant: "destructive",
      });
    }
  };

  const getDescriptionPoints = (description: string): string[] => {
    const points = description.split(/\s+(?=\d+\.\s)/);
    return points
      .map(point => point.trim())
      .filter(point => point.length > 0);
  };


  const handleAddToWishlist = async (productId: string) => {
    await addToWishlist.mutateAsync(productId, {
      onError: (error: any) => {
        toast({
          title: "Failed to add to Wishlist",
          description: error.response.data.message,
        })
      }
    });

    toast({
      title: "Wishlist",
      description: "product added to wishlist"
    })
  }

  const descriptionPoints = getDescriptionPoints(product.description);

  const handleRelatedProductClick = (productId: string) => {
    navigate({ to: `/products/$id`, params: { id: productId } });
  };

  const filteredRelatedProducts: Product[] = useMemo(() => {
    return relatedProducts
      ? relatedProducts.filter((relatedProduct) => relatedProduct._id !== product._id)
      : [];
  }, [relatedProducts, product._id]);

  useEffect(() => {
  }, [filteredRelatedProducts, product._id]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl dark:bg-gray-900 dark:text-white">
      <ProductBreadcrumb product={product} />

      <Card className="shadow-xl border-none overflow-hidden dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="relative">
              <ProductImageCarousel images={product.images} discountPercentage={offerPercentage !== 0 ? offerPercentage : undefined} />
              {stock === 0 && (
                <div className="absolute bottom-0 left-0 right-0 bg-red-600 text-white text-center py-2 font-semibold rounded-b-md">
                  Out of Stock
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <h1 className="text-3xl font-bold dark:text-white">
                    {product.name}
                  </h1>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleShareClick}
                    className="dark:text-white dark:hover:text-gray-300"
                    title="Share product"
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 text-sm dark:text-gray-300">
                  <span>{product.brand}</span>
                  <span className="dark:text-gray-500">•</span>
                  <span>{product.subcategory}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <PriceFormat
                    originalPrice={regularPrice}
                    salePrice={offeredPrice}
                    showSavePercentage={true}
                    classNameSalePrice="text-2xl"
                  />
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Badge className="flex items-center gap-1 dark:bg-gray-700 dark:text-white">
                    <Package className="w-4 h-4" />
                    {stock > 0 ? `${stock} in stock` : "Out of stock"}
                  </Badge>
                  {stock > 0 && (
                    <span className="dark:text-red-400">Only {stock} left!</span>
                  )}
                </div>
              </div>

              {product.variants.map((variant) => (
                <div key={variant._id} className="space-y-2">
                  <p className="font-medium dark:text-white">
                    Select {variant.type}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {variant.values.map((value) => (
                      <Button
                        key={value.value}
                        variant={
                          selectedVariants[variant.type.toLowerCase()]?.value === value.value
                            ? "default"
                            : "outline"
                        }
                        className={`rounded-full px-4 py-2 text-sm transition-all duration-200 dark:text-white ${selectedVariants[variant.type.toLowerCase()]?.value === value.value
                          ? "dark:bg-blue-600 dark:hover:bg-blue-700"
                          : "dark:border-gray-600 dark:hover:bg-gray-700"
                          }`}
                        onClick={() =>
                          setSelectedVariants((prev) => ({
                            ...prev,
                            [variant.type.toLowerCase()]: value,
                          }))
                        }
                      >
                        {value.value}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center border rounded-full overflow-hidden shadow-sm w-32 dark:border-gray-600 dark:bg-gray-700">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleReduceStock(product._id, sku, quantity)}
                    disabled={quantity <= 1}
                    className="h-10 w-10 dark:text-white dark:hover:bg-gray-600"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <Input
                    type="text"
                    value={quantity}
                    readOnly
                    className="w-12 text-center border-none focus:ring-0 font-medium dark:text-white dark:bg-transparent"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleAddStock(product._id, sku, quantity)}
                    disabled={quantity >= stock}
                    className="h-10 w-10 dark:text-white dark:hover:bg-gray-600"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
                <div className="flex gap-3 flex-1">
                  <Button
                    disabled={stock === 0}
                    onClick={() => {
                      if (!isInCart) {
                        handleAddtoCart(id, product._id, sku, quantity);

                        toast({
                          title: "Product added to cart",
                          description: "Go to cart click the button",
                          action: <ToastAction onClick={() => navigate({ to: "/cart" })} altText="go to cart">Cart</ToastAction>
                        })
                      } else {
                        navigate({ to: "/cart" });
                      }
                    }}
                    className="flex-1 flex items-center gap-2 rounded-full py-6 text-base font-medium dark:bg-blue-600 dark:hover:bg-blue-700 dark:disabled:bg-gray-600 dark:text-white"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    {isInCart ? "View Cart" : "Add to Cart"}
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 flex items-center gap-2 rounded-full py-6 text-base font-medium dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white"

                    onClick={() => handleAddToWishlist(product._id)}
                  >
                    <Heart className="w-5 h-5" />
                    Wishlist
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm dark:text-gray-300">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 dark:text-blue-400" />
                  <span>Free Delivery by {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 dark:text-blue-400" />
                  <span>1 Year Warranty</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <h3 className="text-2xl font-semibold dark:text-white mb-4">Product Details</h3>
            <div className="dark:text-gray-300 leading-relaxed dark:bg-gray-700 p-6 rounded-lg space-y-4">
              <ul className="space-y-2">
                {descriptionPoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
              <p className="font-medium">SKU: <span className="font-normal">{sku}</span></p>
            </div>
          </div>

          <div className="mt-12">
            <h3 className="text-2xl font-semibold dark:text-white mb-4">Related Products</h3>
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array(4).fill(0).map((_, index) => (
                  <Card key={index} className="dark:bg-gray-800 dark:border-gray-700">
                    <CardContent className="p-4">
                      <Skeleton className="w-full h-48 rounded-md mb-4 dark:bg-gray-600" />
                      <Skeleton className="h-6 w-3/4 rounded dark:bg-gray-600" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredRelatedProducts.length > 0 ? (
                  filteredRelatedProducts.map((relatedProduct) => (
                    <Card
                      key={relatedProduct._id}
                      className="dark:bg-gray-800 dark:border-gray-700 cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => handleRelatedProductClick(relatedProduct._id)}
                    >
                      <CardContent className="p-4">
                        <img
                          src={relatedProduct.images[0] || "placeholder-image.jpg"}
                          alt={relatedProduct.name}
                          className="w-full h-48 object-cover rounded-md mb-4"
                        />
                        <h4 className="font-semibold dark:text-white">{relatedProduct.name}</h4>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center w-full py-8">
                    <PackageX className="w-12 h-12 dark:text-gray-400 mb-2" />
                    <p className="text-gray-500 dark:text-gray-400">No related products found</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {showCopyMessage && (
        <div className="fixed bottom-6 right-6 dark:bg-blue-600 dark:text-white px-4 py-2 rounded-full shadow-lg animate-fade-in-up">
          Link copied to clipboard!
        </div>
      )}
    </div>
  );
};
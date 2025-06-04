import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Heart } from 'lucide-react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useToast } from '@/hooks';
import { useWishlistMutation } from '@/hooks/wishlist';

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    variants: {
      type: string;
      values: {
        value: string;
        price: string | number;
        stock: string | number;
        sku?: string;
      }[];
    }[];
    images?: string[];
  };
}

export const ProductCard = ({ product }: ProductCardProps) => {

  const { addToWishlist } = useWishlistMutation()
  const { toast } = useToast()

  const navigate = useNavigate()
  const handleAddToCart = (id: string) => {
    navigate({ to: "/products/$id", params: { id } })
  }

  const allVariants = product.variants.flatMap((variant) => variant.values);
  const lowestPrice = allVariants.length > 0
    ? Math.min(...allVariants.map((v) => Number(v.price) || 0))
    : 0;

  const formattedPrice = lowestPrice > 0
    ? `₹${lowestPrice.toLocaleString('en-IN')}`
    : "Price TBD";


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

  return (
    <Card
      className="w-[280px] group rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 bg-white relative overflow-hidden"
    >
      <CardContent className="p-4 flex flex-col h-full">
        <div className="relative aspect-[4/3] w-full mb-4">
          <Link to={"/products/$id"} params={{ id: product._id }}>
            <img
              src={product?.images?.[0]}
              alt={product.name}
              className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
            />
          </Link>
        </div>

        <div className="flex flex-col items-start space-y-2 mb-4">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xl font-bold text-gray-800">
            {formattedPrice}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            className="flex-1 bg-gray-200 text-gray-800 font-medium  py-2 rounded-lg hover:bg-primary hover:text-white transition-all duration-300 text-sm"
            onClick={() => handleAddToCart(product._id)}
          >
            <ShoppingBag className="mr-1 h-4 w-4 text-primary " /> Add to Cart
          </Button>
          <Button onClick={() => handleAddToWishlist(product._id)}
            className="flex-1 bg-red-500 text-white font-medium py-2 rounded-lg hover:bg-red-600 transition-all duration-300 text-sm"
          >
            <Heart className="mr-1 h-4 w-4" /> Wishlist
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
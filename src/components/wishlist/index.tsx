import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ArrowUpToLine, Trash2, ShoppingCart } from 'lucide-react';
import { useWishlistMutation, useWishlistQuery } from '@/hooks/wishlist';
import { useNavigate } from '@tanstack/react-router';
import { Pagination } from '../pagination';
import { useToast } from '@/hooks';
import { Link } from '@tanstack/react-router';

interface WishlistItem {
  productId: {
    _id: string;
    name: string;
    images: string;
  };
}

export function WishlistPage() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;
  const { toast } = useToast()

  const { data, isLoading, isError } = useWishlistQuery(currentPage, itemsPerPage);
  const { removeWishlist } = useWishlistMutation()

  const navigate = useNavigate();
  const wishlistItems = data?.data?.products || [];
  const totalItems = data?.total || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);


  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const onRemoveItem = async (id: string) => {
    await removeWishlist.mutateAsync(id, {
      onSuccess: () => {
        toast({
          title: "Your Wishlist",
          description: "Item removed from wishlist",
        })

        const updatedWishlistItems = wishlistItems.filter(
          (item: WishlistItem) => item.productId._id !== id
        );
  
        if (updatedWishlistItems.length === 0 && currentPage > 1) {
          setCurrentPage(1);
        }
      },
      onError: (error: any) => {
        console.log(error)
        toast({
          title: "Your Wishlist",
          description: error.response.data.message,
          variant: "destructive"
        })
      }
    })



  };

  const onAddToCart = (item: WishlistItem) => {
    navigate({ to: "/products/$id", params: { id: item.productId._id } })
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-7xl text-center">
        <div className="animate-pulse text-gray-500">Loading wishlist...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-7xl text-center">
        <p className="text-red-600">Failed to load wishlist. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 p-3 bg-primary text-white rounded-full shadow-lg hover:bg-primary-dark transition-colors z-10"
        aria-label="Back to top"
      >
        <ArrowUpToLine className="h-5 w-5" />
      </button>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
        <span className="text-sm font-medium bg-gray-100 px-4 py-2 rounded-full text-gray-600">
          {totalItems} {totalItems === 1 ? 'item' : 'items'}
        </span>
      </div>

      {wishlistItems?.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl shadow-sm">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
            <Heart className="h-8 w-8 text-gray-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Save items you love by clicking the heart icon on product pages.
          </p>
          <Button className="px-6 py-2 text-sm">
            <Link to='/shop'>
              Continue Shopping
            </Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {wishlistItems.map((item: WishlistItem) => (
              <Card
                key={item.productId._id}
                className="group relative overflow-hidden border border-gray-200 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 bg-white"
              >
                <div className="relative w-full h-64 bg-gray-100">
                  <img
                    src={item.productId.images}
                    alt={item.productId.name}
                    className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <CardContent className="p-4">
                  <h3 className="text-xl font-semibold text-gray-900 line-clamp-2 mb-4">
                    {item.productId.name}
                  </h3>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 h-10 text-sm font-medium bg-primary hover:bg-primary-dark text-white"
                      onClick={() => onAddToCart(item)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-10 w-10 p-0 text-red-600 hover:text-red-700 hover:border-red-600"
                      onClick={() => onRemoveItem(item.productId._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Pagination isLoading={isLoading} onPageChange={setCurrentPage} page={currentPage} totalPages={totalPages} />
        </>
      )}
    </div>
  );
}
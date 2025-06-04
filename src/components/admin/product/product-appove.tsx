import { useState, useEffect } from 'react';
import { useAllProducts } from '@/hooks/useAllProducts';
import { useProductMutations } from '@/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks';
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Product } from './types';
import { ConfirmationDialog } from './product-approve';
import { AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const ProductApprove: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState<boolean>(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState<boolean>(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [productToAction, setProductToAction] = useState<Product | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: productData, isSuccess } = useAllProducts("status=pending");
  const { approveProduct, rejectProduct } = useProductMutations();

  useEffect(() => {
    if (isSuccess && productData?.data) {
      const formattedProducts = productData.data.map((item: any) => ({
        id: item._id,
        name: item.name,
        description: item.description,
        price: item.price || 0,
        images: item.images,
        isApproved: item.isApproved,
        isBlocked: item.isBlocked,
        brand: item.brand,
        category: item.category,
        subcategory: item.subcategory,
        vendor: {
          id: item.vendorId?._id,
          username: item.vendorId?.username,
          email: item.vendorId?.email,
          phone: item.vendorId?.phone,
        },
        variants: item.variants.map((v: any) => ({
          _id: v._id,
          type: v.type,
          values: v.values.map((val: any) => ({
            value: val.value || val,
            price: val.price || undefined,
            offer: val.offeredPrice || undefined,
            stock: val.stock || undefined,
          })),
        })),
      }));
      setProducts(formattedProducts);
    }
  }, [isSuccess, productData]);

  const handleApprove = (product: Product) => {
    setProductToAction(product);
    setIsApproveDialogOpen(true);
  };

  const confirmApprove = async () => {
    if (productToAction) {
      try {
        await approveProduct.mutateAsync(productToAction.id);
        toast({
          title: "Approve Product",
          description: "Product approved successfully",
          variant: "default",
        });
        queryClient.invalidateQueries({ queryKey: ["all-products"] });
        setIsApproveDialogOpen(false);
        setProductToAction(null);
      } catch (error) {
        console.error('Approval failed:', error);
        setIsApproveDialogOpen(false);
        setProductToAction(null);
      }
    }
  };

  const handleReject = (product: Product) => {
    setProductToAction(product);
    setIsRejectDialogOpen(true);
  };

  const confirmReject = async () => {
    if (productToAction) {
      try {
        await rejectProduct.mutateAsync(productToAction.id);
        toast({
          title: "Reject Product",
          description: "Product rejected successfully",
          variant: "default",
        });
        queryClient.invalidateQueries({ queryKey: ["wijk/all-products"] });
        setIsRejectDialogOpen(false);
        setProductToAction(null);
      } catch (error) {
        console.error('Rejection failed:', error);
        setIsRejectDialogOpen(false);
        setProductToAction(null);
      }
    }
  };

  const handleView = (product: Product) => {
    setSelectedProduct(product);
    setCurrentImageIndex(0);
    setIsViewModalOpen(true);
  };

  const getTotalStock = (product: Product) => {
    return product.variants.reduce((total, variant) =>
      total + variant.values.reduce((sum, val) => sum + (val.stock || 0), 0), 0);
  };

  const   getPriceLowestPrice = (product: Product) => {
    const prices = product.variants
      .flatMap((variant) => variant.values.map((val) => val.price))
      .filter((price): price is number => price !== undefined);
      
      console.log("offerd price is: ",prices)
    return prices.length > 0 ? Math.min(...prices) : product.price || 0;
  };



  // Format description as a list of points
  const formatDescription = (description: string) => {
    const points = description.split('\n').filter(point => point.trim() !== '');
    return points.length > 0 ? points : ['No description available'];
  };

  // Carousel navigation
  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? (selectedProduct?.images.length || 1) - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === (selectedProduct?.images.length || 1) - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold text-primary mb-6">Unapproved Products</h1>
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <AlertCircle className="w-12 h-12 mb-4" />
          <p className="text-lg">No unapproved products found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <img
                  src={product.images[0] || '/fallback-image.jpg'}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md transition-colors"
                  onClick={() => handleApprove(product)}
                >
                  Approve
                </Button>
                <Button
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors"
                  onClick={() => handleView(product)}
                >
                  View
                </Button>
                <Button
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition-colors"
                  onClick={() => handleReject(product)}
                >
                  Reject
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Approval Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isApproveDialogOpen}
        onOpenChange={setIsApproveDialogOpen}
        title="Confirm Approval"
        description={`Are you sure you want to approve "${productToAction?.name}"?`}
        actionText="Approve"
        onConfirm={confirmApprove}
        isPending={approveProduct.isPending}
      />

      {/* Rejection Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isRejectDialogOpen}
        onOpenChange={setIsRejectDialogOpen}
        title="Confirm Rejection"
        description={`Are you sure you want to reject "${productToAction?.name}"?`}
        actionText="Reject"
        onConfirm={confirmReject}
        isPending={rejectProduct.isPending}
      />

      {/* Product Details Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedProduct?.name}</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-6 p-4">
              {/* Image Carousel */}
              <div className="relative">
                <img
                  src={selectedProduct.images[currentImageIndex] || '/fallback-image.jpg'}
                  alt={`${selectedProduct.name} - Image ${currentImageIndex + 1}`}
                  className="w-full h-60 object-cover rounded-md"
                />
                {selectedProduct.images.length > 1 && (
                  <>
                    <Button
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full"
                      onClick={handlePrevImage}
                      disabled={selectedProduct.images.length <= 1}
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </Button>
                    <Button
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full"
                      onClick={handleNextImage}
                      disabled={selectedProduct.images.length <= 1}
                    >
                      <ChevronRight className="w-6 h-6" />
                    </Button>
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-gray-800 bg-opacity-50 text-white px-2 py-1 rounded-md">
                      {currentImageIndex + 1} / {selectedProduct.images.length}
                    </div>
                  </>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold">Description</h3>
                <ol className="list-decimal ml-6 text-gray-700">
                  {formatDescription(selectedProduct.description).map((point) => (
                    <li className="mb-2">{point.split('').slice(2).join('')}</li>
                  ))}
                </ol>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Price</h3>
                <p className="text-primary font-semibold">
                  ₹{getPriceLowestPrice(selectedProduct).toLocaleString('en-IN')}
                </p>
                
              </div>
              <div>
                <h3 className="text-lg font-semibold">Stock</h3>
                <p className="text-gray-600">{getTotalStock(selectedProduct)}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Vendor</h3>
                <p className="text-gray-600">Username: {selectedProduct.vendor.username}</p>
                <p className="text-gray-600">Email: {selectedProduct.vendor.email}</p>
                <p className="text-gray-600">Phone: {selectedProduct.vendor.phone}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Category</h3>
                <p className="text-gray-600">{selectedProduct.category}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Subcategory</h3>
                <p className="text-gray-600">{selectedProduct.subcategory}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Brand</h3>
                <p className="text-gray-600">{selectedProduct.brand}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Variants</h3>
                {selectedProduct.variants.map((variant) => (
                  <div key={variant._id} className="ml-4">
                    <p className="font-medium">{variant.type}</p>
                    <ul className="list-disc ml-6">
                      {variant.values.map((val, index) => (
                        <li key={index}>
                          {val.value} - Price: ₹{val.price?.toLocaleString('en-IN') || 'N/A'}, Stock: {val.stock || 'N/A'}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
          <DialogClose asChild>
            <Button className="mt-4">Close</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductApprove;
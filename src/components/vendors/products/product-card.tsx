import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Edit,
    Lock,
    Unlock,
    Eye,
    Calendar,
    Package,
    Tag,
    Truck,
    DollarSign,
    ChevronLeft,
    ChevronRight,
    Image as ImageIcon,
    CheckCircle,
    RefreshCw,
    IndianRupeeIcon,
} from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Product } from '@/types/shop-product';
import { TooltipContent, TooltipProvider, TooltipTrigger, Tooltip } from '@/components/ui/tooltip';
import { toast, useProductMutations } from '@/hooks';
import { useNavigate } from '@tanstack/react-router';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

const statusColors: Record<string, string> = {
    approved: "bg-green-500 hover:bg-green-700 text-white",
    pending: "bg-yellow-500 hover:bg-yellow-700 text-white",
    rejected: "bg-red-500 hover:bg-red-700 text-white",
};

interface ProductCardProps {
    product: Product;
    onToggleBlock?: (productId: string, isBlocked: boolean) => void;
}

const CustomCarousel = ({ images, productName, inSheet = false }: { images: string[], productName: string, inSheet?: boolean }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % images.length);
    const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

    return (
        <div className="relative group">
            <div className={cn(
                "relative overflow-hidden",
                inSheet ? "aspect-[3/2] max-h-64" : "aspect-[4/3] w-full"
            )}>
                {images.length > 0 ? (
                    <img
                        src={images[currentIndex]}
                        alt={`${productName} ${currentIndex + 1}`}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gray-100">
                        <ImageIcon className="h-12 w-12 text-gray-300" />
                    </div>
                )}
                {images.length > 1 && (
                    <>
                        <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full bg-black/50 hover:bg-black/70 text-white" onClick={prevSlide}>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full bg-black/50 hover:bg-black/70 text-white" onClick={nextSlide}>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                            {images.map((_, index) => (
                                <button
                                    key={index}
                                    className={cn(
                                        "h-1.5 rounded-full transition-all",
                                        currentIndex === index ? "w-4 bg-white" : "w-1.5 bg-white/50"
                                    )}
                                    onClick={() => setCurrentIndex(index)}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export const ProductCard = ({ product, onToggleBlock }: ProductCardProps) => {
    const [showDetails, setShowDetails] = useState(false);
    const [showBlockConfirm, setShowBlockConfirm] = useState(false);
    const [isBlocking, setIsBlocking] = useState(false);
    const navigate = useNavigate();

    const allVariantValues = product.variants.flatMap(variant => variant.values);
    const lowestPrice = allVariantValues.length > 0 ? Math.min(...allVariantValues.map(v => v.price)) : undefined;
    const offerPrice = allVariantValues.length > 0 ? Math.min(...allVariantValues.map(v => v.offeredPrice)) : "";
    const totalStock = allVariantValues.length > 0 ? allVariantValues.reduce((sum, v) => sum + v.stock, 0) : undefined;

    const categoryName = typeof product.category === 'string' ? product.category : 'N/A';
    const subcategoryName = typeof product.subcategory === 'string' ? product.subcategory : "";

    const isBlocked = product.isBlocked ?? false;
    const { updateProduct } = useProductMutations();

    const handleReapproveProduct = async (id: string): Promise<void> => {
        try {
            const productData: Partial<Product> = { status: "pending" };
            await updateProduct.mutateAsync({ productId: id, productData }, {
                onSuccess: () => {
                    toast({
                        title: "Re-approve request",
                        description: "Request for re-approve is successfully sent"
                    });
                },
                onError: (error) => {
                    console.log("error is good: ", error);
                }
            });
        } catch (error) {
            toast({
                title: "Something went wrong",
                description: "Failed to re-approve product"
            });
        }
    };

    const handleBlockConfirm = async () => {
        if (!onToggleBlock) return;
        setIsBlocking(true);
        try {
            await onToggleBlock(product._id, true);
            setShowBlockConfirm(false);
            toast({
                title: "Product Blocked",
                description: `${product.name} has been successfully blocked`
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to block product"
            });
        } finally {
            setIsBlocking(false);
        }
    };

    return (
        <>
            <Card className="w-full group hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                <CardContent className="p-0 flex-grow">
                    <div className="relative">
                        <CustomCarousel images={product.images} productName={product.name} />
                        <div className="absolute top-2 right-2 flex gap-2">
                            {product.isBlocked !== undefined && (
                                <Badge variant={isBlocked ? "destructive" : "secondary"} className="bg-black/50 text-white hover:bg-black/70">
                                    {isBlocked ? 'Blocked' : 'Active'}
                                </Badge>
                            )}
                            <Badge
                                variant="secondary"
                                className={`${statusColors[product.status] || "bg-gray-500 hover:bg-gray-700 text-white"} capitalize`}
                            >
                                {product.status}
                            </Badge>
                            {product.status === 'rejected' && (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                size={"icon"}
                                                className="h-8 w-8 rounded-full bg-black/50 hover:bg-black/70 text-white"
                                                onClick={() => handleReapproveProduct(product._id)}
                                            >
                                                <RefreshCw className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Request for re-approve</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}
                            <Button
                                size="icon"
                                className="h-8 w-8 rounded-full bg-black/50 hover:bg-black/70 text-white"
                                onClick={() => setShowDetails(true)}
                            >
                                <Eye className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    <div className="p-4 space-y-2">
                        <h3 className="text-lg font-semibold text-primary line-clamp-1">{product.name}</h3>
                        <p className="text-sm text-gray-500 line-clamp-1">{product.brand}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Package className="h-4 w-4" />
                            <span>{categoryName}</span>
                        </div>
                        {lowestPrice !== undefined && (
                            <div className="flex items-center gap-2 text-sm text-primary font-medium">
                                <IndianRupeeIcon className="h-4 w-4" />
                                <span>Starting at ₹{lowestPrice.toLocaleString()}</span>
                                <span>Offered at ₹{offerPrice.toLocaleString()}</span>
                            </div>
                        )}
                        {totalStock !== undefined && (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Truck className="h-4 w-4" />
                                <span>{totalStock} in stock</span>
                            </div>
                        )}
                    </div>
                </CardContent>
                <CardFooter className="px-4 py-4 mt-auto">
                    <div className="grid grid-cols-2 gap-2 w-full">
                        {onToggleBlock && (
                            <Button
                                variant="outline"
                                size="sm"
                                className={cn(
                                    "w-full transition-colors",
                                    isBlocked ? "text-red-500 hover:text-red-700 hover:bg-red-50" : "text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                                )}
                                onClick={() => {
                                    if (isBlocked) {
                                        onToggleBlock(product._id, false);
                                    } else {
                                        setShowBlockConfirm(true);
                                    }
                                }}
                            >
                                {isBlocked ? <Unlock className="h-4 w-4 mr-2" /> : <Lock className="h-4 w-4 mr-2" />}
                                {isBlocked ? 'Unblock' : 'Block'}
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full text-blue-500 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                            onClick={() => navigate({ to: "/vendor/products/$id", params: { id: product._id } })}
                        >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                        </Button>
                    </div>
                </CardFooter>
            </Card>

            <Dialog open={showBlockConfirm} onOpenChange={setShowBlockConfirm}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Block Product</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to block "{product.name}"? This action will make the product unavailable for purchase.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowBlockConfirm(false)}
                            disabled={isBlocking}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleBlockConfirm}
                            disabled={isBlocking}
                        >
                            {isBlocking ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Blocking...
                                </>
                            ) : (
                                'Block Product'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Sheet open={showDetails} onOpenChange={setShowDetails}>
                <SheetContent side="right" className="w-full sm:max-w-xl p-0">
                    <ScrollArea className="h-full px-6">
                        <div className="py-6">
                            <SheetHeader className="space-y-4">
                                <SheetTitle className="text-primary">{product.name}</SheetTitle>
                                <CustomCarousel images={product.images} productName={product.name} inSheet={true} />
                            </SheetHeader>
                            <div className="mt-6 space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-primary">
                                        <Tag className="h-5 w-5" />
                                        <span className="font-medium">Brand:</span>
                                        <span>{product.brand}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-primary">
                                        <Package className="h-5 w-5" />
                                        <span className="font-medium">Category:</span>
                                        <span>{categoryName}</span>
                                    </div>
                                    {subcategoryName && (
                                        <div className="flex items-center gap-2 text-primary">
                                            <Package className="h-5 w-5" />
                                            <span className="font-medium">Subcategory:</span>
                                            <span>{subcategoryName}</span>
                                        </div>
                                    )}
                                    {product.createdAt && (
                                        <div className="flex items-center gap-2 text-primary">
                                            <Calendar className="h-5 w-5" />
                                            <span className="font-medium">Created:</span>
                                            <span>{new Date(product.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                    {product.isApproved !== undefined && (
                                        <div className="flex items-center gap-2 text-primary">
                                            <CheckCircle className="h-5 w-5" />
                                            <span className="font-medium">Approval Status:</span>
                                            <Badge variant={product.isApproved ? "secondary" : "destructive"}>
                                                {product.isApproved ? 'Approved' : 'Pending'}
                                            </Badge>
                                        </div>
                                    )}
                                    {product.variants.length > 0 && (
                                        <div className="space-y-2">
                                            <h4 className="font-medium text-primary">Variants</h4>
                                            {product.variants.map((variant) => (
                                                <div key={variant._id} className="space-y-1">
                                                    <p className="text-sm font-medium text-gray-700">{variant.type}</p>
                                                    {variant.values.map((value, index) => (
                                                        <div key={index} className="flex items-center gap-2 text-sm text-gray-500">
                                                            <span>{value.value}:</span>
                                                            <DollarSign className="h-4 w-4" />
                                                            <span>${value.price.toLocaleString()}</span>
                                                            <Truck className="h-4 w-4" />
                                                            <span>{value.stock} units</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {product.description && (
                                    <div className="space-y-2">
                                        <h4 className="font-medium text-primary">Description</h4>
                                        <p className="text-sm text-gray-500">{product.description}</p>
                                    </div>
                                )}
                                <div className="flex gap-2 pt-4 pb-8">
                                    <Button
                                        variant="outline"
                                        className="w-full text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                                        onClick={() => navigate({ to: "/vendor/products/$id", params: { id: product._id } })}
                                    >
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit Product
                                    </Button>
                                    {onToggleBlock && (
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full",
                                                isBlocked ? "text-red-500 hover:text-red-700 hover:bg-red-50" : "text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                                            )}
                                            onClick={() => {
                                                if (isBlocked) {
                                                    onToggleBlock(product._id, false);
                                                } else {
                                                    setShowBlockConfirm(true);
                                                }
                                            }}
                                        >
                                            {isBlocked ? <Unlock className="h-4 w-4 mr-2" /> : <Lock className="h-4 w-4 mr-2" />}
                                            {isBlocked ? 'Unblock Product' : 'Block Product'}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                </SheetContent>
            </Sheet>
        </>
    );
};
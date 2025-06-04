import { CartItem as CartItemType } from "@/types/cart/type";
import { Button } from "@/components/ui/button";
import { MinusIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { useCartMutation } from "@/hooks/cart/useCart";


interface CartItemProps {
    item: CartItemType;
}


const CartItem = ({ item }: CartItemProps) => {
    const { product, quantity } = item;

    const { minusQuantity, plusQuantity, deleteCart } = useCartMutation()

    const handlePlusQuantity = (id: string, sku: string) => {
        const payload = {
            id, sku, action: "increase",quantity
        }
        minusQuantity.mutate(payload)
    };


    const handleMinusQuantity = (id: string, sku: string) => {
        const payload = {
            id, sku, action: "deincrease",quantity
        }
        plusQuantity.mutateAsync(payload)
    };

    const handleDelete = (id: string, sku: string) => {
        const payload = {
            id, sku
        }
        deleteCart.mutate(payload)

    }

    return (
        <div className="flex flex-col md:flex-row items-start md:items-center py-4 space-y-4 md:space-y-0 border-b ">
            <div className="flex-shrink-0 w-full md:w-auto">
                <div className="w-full md:w-24 h-24 rounded-md overflow-hidden bg-gray-100">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            <div className="flex-grow px-4">
                <h3 className="font-medium text-lg">{product.name}</h3>
                <p className="text-gray-500">Unit Price: {(product.price)}</p>
            </div>

            <div className="flex items-center w-full md:w-auto">
                <div className="flex items-center border rounded-md overflow-hidden">
                    <Button
                        variant="ghost"
                        size="icon"
                        disabled={quantity <= 1}
                        className={`h-9 rounded-none ${quantity <= 1 ? "cursor-not-allowed opacity-50" : ""}`}
                        onClick={() => handleMinusQuantity(product.id, product.name)}
                    >
                        <MinusIcon size={16} />
                    </Button>


                    <span className="px-4 py-2 text-center w-12">{quantity}</span>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 rounded-none"
                        onClick={() => handlePlusQuantity(product.id, product.name)}
                    >
                        <PlusIcon size={16} />
                    </Button>
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    className="ml-2 text-gray-500 hover:text-red-500"
                    onClick={() => handleDelete(product.id, product.name)}
                >
                    <Trash2Icon size={18} />
                </Button>
            </div>

            <div className="text-right font-medium w-full md:w-32">
                {(product.price * quantity)}
            </div>
        </div>
    );
};

export default CartItem;
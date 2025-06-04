import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const RelatedProducts: React.FC = () => (
    <div className="mt-12">
        <h3 className="text-2xl font-bold mb-4 dark:text-white">Frequently Bought Together</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
                <Card key={item} className="p-4 shadow-md hover:shadow-lg transition-shadow">
                    <img
                        src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&q=80"
                        alt="Related Product"
                        className="w-full h-32 object-cover rounded-md mb-3"
                    />
                    <p className="font-semibold dark:text-gray-100">Related Item {item}</p>
                    <p className="text-muted-foreground dark:text-gray-400">₹{Math.floor(Math.random() * 5000 + 1000)}</p>
                    <Button variant="outline" size="sm" className="mt-2 w-full">
                        Add to Cart
                    </Button>
                </Card>
            ))}
        </div>
    </div>
);
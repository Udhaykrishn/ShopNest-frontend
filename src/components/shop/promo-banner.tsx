import { Button } from "../ui/button";

export const PromoBanner: React.FC = () => (
    <div className="container py-6">
        <div className="bg-primary/10 dark:bg-primary/20 p-4 rounded-lg text-center">
            <h3 className="text-xl font-semibold dark:text-white">Limited Time Offer!</h3>
            <p className="text-muted-foreground dark:text-gray-300">Get 20% off on selected items. Shop now!</p>
            <Button className="mt-4">Shop Deals</Button>
        </div>
    </div>
);
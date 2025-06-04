import { Control, FieldArrayWithId } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { FormData } from '@/types';

interface VariantsManagerProps {
    variants: FieldArrayWithId<FormData, "variants", "id">[];
    control: Control<FormData>;
}

const VariantsManager = ({ variants, control }: VariantsManagerProps) => {
    // Format the variant title for display
    const formatVariantTitle = (attributes: Record<string, string>) => {
        return Object.entries(attributes)
            .map(([key, value]) => `${key}: ${value}`)
            .join(' / ');
    };

    return (
        <div className="space-y-4 mt-8">
            <h3 className="text-lg font-medium">Product Variants</h3>
            <FormDescription>
                Each variant can have its own price and stock. All variants are automatically generated based on your attributes.
            </FormDescription>

            {variants.length > 0 ? (
                <Accordion type="multiple" className="w-full">
                    {variants.map((variant, index) => (
                        <AccordionItem key={variant.id} value={variant.id}>
                            <AccordionTrigger className="px-4 py-2 hover:bg-gray-50">
                                <span className="flex items-center">
                                    {formatVariantTitle(variant.attributes)}
                                </span>
                            </AccordionTrigger>
                            <AccordionContent className="px-4 py-2">
                                <div className="grid grid-cols-3 gap-4">
                                    <FormField
                                        control={control}
                                        name={`variants.${index}.price`}
                                        rules={{
                                            required: 'Price is required',
                                            pattern: {
                                                value: /^\d+(\.\d{1,2})?$/,
                                                message: 'Please enter a valid price'
                                            }
                                        }}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Price</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="0.00"
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={control}
                                        name={`variants.${index}.stock`}
                                        rules={{
                                            required: 'Stock is required',
                                            pattern: {
                                                value: /^\d+$/,
                                                message: 'Please enter a valid number'
                                            }
                                        }}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Stock</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="0"
                                                        type="number"
                                                        min="0"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={control}
                                        name={`variants.${index}.sku`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>SKU (Optional)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Product SKU"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            ) : (
                <div className="p-8 text-center border rounded-md">
                    <p className="text-gray-500">No variants yet. Add attributes to generate variants.</p>
                </div>
            )}
        </div>
    );
};

export default VariantsManager;
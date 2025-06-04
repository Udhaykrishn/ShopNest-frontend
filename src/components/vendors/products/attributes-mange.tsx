import { Control, FieldArrayWithId, UseFormGetValues, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { ProductAttribute } from '@/types';

interface AttributesManagerProps {
    attributes: FieldArrayWithId<ProductAttribute, "attributes", "id">[];
    control: Control<ProductAttribute>;
    onAddAttribute: () => void;
    onRemoveAttribute: (index: number) => void;
    getValues: UseFormGetValues<ProductAttribute>;
    setValue: UseFormSetValue<ProductAttribute>;
    watch: UseFormWatch<ProductAttribute>;
}

const AttributesManager = ({
    attributes,
    control,
    onAddAttribute,
    onRemoveAttribute,
    getValues,
    setValue,
    watch
}: AttributesManagerProps) => {

    const handleAddOption = (attributeIndex: number) => {
        const currentOptions = getValues(`attributes.${attributeIndex}.options`);
        setValue(`attributes.${attributeIndex}.options`, [
            ...currentOptions,
            { id: Math.random().toString(36).substring(2, 9), value: '' }
        ]);
    };

    const handleRemoveOption = (attributeIndex: number, optionIndex: number) => {
        const currentOptions = getValues(`attributes.${attributeIndex}.options`);
        if (currentOptions.length <= 1) return;

        const updatedOptions = currentOptions.filter((_, idx) => idx !== optionIndex);
        setValue(`attributes.${attributeIndex}.options`, updatedOptions);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Product Attributes</h3>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onAddAttribute}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Attribute
                </Button>
            </div>

            {attributes.map((field, attributeIndex) => (
                <div key={field.id} className="p-4 border rounded-md">
                    <div className="flex items-center justify-between mb-4">
                        <FormField
                            control={control}
                            name={`attributes.${attributeIndex}.name`}
                            rules={{ required: 'Attribute name is required' }}
                            render={({ field }) => (
                                <FormItem className="flex-1 mr-4">
                                    <FormLabel>Attribute Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Size, Color" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => {
                                if (attributes.length > 1) {
                                    onRemoveAttribute(attributeIndex);
                                }
                            }}
                            disabled={attributes.length <= 1}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="space-y-2">
                        <FormLabel>Options</FormLabel>
                        {watch(`attributes.${attributeIndex}.options`)?.map((option, optionIndex) => (
                            <div key={option.id} className="flex items-center">
                                <FormField
                                    control={control}
                                    name={`attributes.${attributeIndex}.options.${optionIndex}.value`}
                                    rules={{ required: 'Option value is required' }}
                                    render={({ field }) => (
                                        <FormItem className="flex-1 mr-2">
                                            <FormControl>
                                                <Input placeholder="Option value" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleRemoveOption(attributeIndex, optionIndex)}
                                    disabled={watch(`attributes.${attributeIndex}.options`)?.length <= 1}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => handleAddOption(attributeIndex)}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Option
                    </Button>
                </div>
            ))}
        </div>
    );
};

export default AttributesManager;
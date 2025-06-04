// CategorySelector.tsx
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';

interface CategorySelectorProps {
    form: UseFormReturn;
    categories: Record<string, string[]>;
}

export const CategorySelector = ({ form, categories }: CategorySelectorProps) => (
    <div className="grid grid-cols-2 gap-4">
        <FormField
            control={form.control}
            name="category"
            rules={{ required: 'Category is required' }}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {Object.keys(categories).map((category) => (
                                <SelectItem key={category} value={category}>
                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}
        />

        <FormField
            control={form.control}
            name="subcategory"
            rules={{ required: 'Subcategory is required' }}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Subcategory</FormLabel>
                    <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={!form.watch('category')}
                    >
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select subcategory" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {form.watch('category') &&
                                categories[form.watch('category')].map((sub) => (
                                    <SelectItem key={sub} value={sub}>
                                        {sub}
                                    </SelectItem>
                                ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}
        />
    </div>
);
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

export const PriceInputGroup: React.FC<{
    form: UseFormReturn<FormData>;
    regularName: string;
    offeredName: string;
    prefix?: string;
}> = ({ form, regularName, offeredName, prefix = "" }) => {
    const restrictToNumbers = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (['e', 'E', '+', '-', '.'].includes(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
            e.preventDefault();
        }
    };

    return (
        <div className="grid grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name={`${prefix}${regularName}` as any}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Regular Price</FormLabel>
                        <FormControl>
                            <Input
                                placeholder="100.00"
                                type="number"
                                step="0.01"
                                min="100"
                                {...field}
                                onKeyDown={restrictToNumbers}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name={`${prefix}${offeredName}` as any}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Offered Price</FormLabel>
                        <FormControl>
                            <Input
                                placeholder="10.00"
                                type="number"
                                step="0.01"
                                min="10"
                                {...field}
                                onKeyDown={restrictToNumbers}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
};
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { UseFormReturn, FieldValues, Path } from 'react-hook-form';

interface FormFieldProps<T extends FieldValues> {
    form: UseFormReturn<T>;
    name: Path<T>;
    label: string;
    placeholder: string;
    rules?: Record<string, never>;
}

export const TextInputField = <T extends FieldValues>({
    form,
    name,
    label,
    placeholder,
    rules
}: FormFieldProps<T>) => (
    <FormField
        control={form.control}
        name={name}
        rules={rules}
        render={({ field }) => (
            <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                    <Input placeholder={placeholder} {...field} />
                </FormControl>
                <FormMessage />
            </FormItem>
        )}
    />
);

export const TextAreaField = <T extends FieldValues>({
    form,
    name,
    label,
    placeholder,
    rules
}: FormFieldProps<T>) => (
    <FormField
        control={form.control}
        name={name}
        rules={rules}
        render={({ field }) => (
            <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                    <Textarea placeholder={placeholder} {...field} />
                </FormControl>
                <FormMessage />
            </FormItem>
        )}
    />
);

import React from 'react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format as formatDate } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema } from "@/types"
import * as z from "zod"

interface CouponFormProps {
    onSubmit: (values: z.infer<typeof formSchema>) => void;
    defaultValues?: z.infer<typeof formSchema>;
    submitButtonText: string;
}

export const CouponForm: React.FC<CouponFormProps> = ({ onSubmit, defaultValues, submitButtonText }) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues || {
            name: '',
            offerPrice: 0,
            min_price: 0,
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-md mx-auto">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-primary">Coupon Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter coupon name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="offerPrice"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-primary">Offer Price</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="Enter offer price"
                                    {...field}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="min_price"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-primary">Minimum Price</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="Enter minimum price"
                                    {...field}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="expireOn"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel className="text-primary">Expiry Date</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                'w-full pl-3 text-left font-normal',
                                                !field.value && 'text-muted-foreground'
                                            )}
                                        >
                                            {field.value ? (
                                                formatDate(field.value, 'PPP')
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) => date < new Date()}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full">
                    {submitButtonText}
                </Button>
            </form>
        </Form>
    );
};
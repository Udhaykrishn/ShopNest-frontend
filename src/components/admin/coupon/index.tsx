import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { format, parse } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks';
import { useCouponMutation } from '@/hooks/coupon';
import { CouponTable } from './coupon-table';
import { Coupon } from '@/types';
import { useNavigate } from '@tanstack/react-router';
import { router } from '@/router';

interface CouponQueryData {
    data: Coupon[];
    total: number;
}

const formSchema = z.object({
    name: z.string().trim().min(3, 'Name must be at least 3 characters'),
    offerPrice: z.number().min(1, 'Offer price must be at least 1'),
    min_price: z.number().min(1, 'Minimum price must be at least 1'),
    expireOn: z.date().refine(
        (date) => !isNaN(date.getTime()) && date > new Date(),
        'Expiry date must be in the future'
    ),
});

const editFormSchema = z.object({
    name: z.string().trim().min(3, 'Name must be at least 3 characters'),
    offerPrice: z.number().min(1, 'Offer price must be at least 1'),
    min_price: z.number().min(1, 'Minimum price must be at least 1'),
    expireOn: z.date().refine(
        (date) => !isNaN(date.getTime()),
        'Please select a valid date'
    ),
});

export const CouponManagement = ({ data, limit, search, page }: { data: CouponQueryData, page: any, limit: any, search: any }) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('coupons');
    const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
    const { toast } = useToast();
    const { addCoupon, editCoupon } = useCouponMutation();
    const navigate = useNavigate();
    const itemsPerPage = limit || 5;
    const currentPage = page || 1;
    const searchTerm = search || '';

    const addForm = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: 'onChange',
        defaultValues: {
            name: '',
            offerPrice: 0,
            min_price: 0,
            expireOn: new Date(),
        },
    });

    const editForm = useForm<z.infer<typeof editFormSchema>>({
        resolver: zodResolver(editFormSchema),
        mode: 'onChange',
        defaultValues: {
            name: '',
            offerPrice: 0,
            min_price: 0,
            expireOn: new Date(),
        },
    });

    const onAddSubmit = async (values: z.infer<typeof formSchema>) => {
        await addCoupon.mutateAsync(values, {
            onSuccess: () => {
                toast({
                    title: 'Coupon Added',
                    description: `Coupon ${values.name} has been added successfully.`,
                });
                addForm.reset();
                router.navigate({ to: "/admin/coupon", search: { page, limit, search } });
                setActiveTab('coupons');
            },
            onError: (error: any) => {
                toast({
                    title: "Coupon create failed",
                    description: error.response?.data?.message || "Failed to create coupon",
                    variant: "destructive",
                });
            },
        });
    };

    const onEditSubmit = useCallback(
        (values: z.infer<typeof editFormSchema>) => {
            if (!selectedCoupon) return;
            editCoupon.mutateAsync(
                {
                    couponId: selectedCoupon._id,
                    couponData: {
                        name: values.name,
                        offerPrice: values.offerPrice,
                        min_price: values.min_price,
                        expireOn: format(values.expireOn, 'MM/dd/yyyy'),
                        isExpired: values.expireOn < new Date(),
                    },
                },
                {
                    onSuccess: () => {
                        toast({
                            title: 'Coupon Updated',
                            description: `Coupon ${values.name} has been updated successfully.`,
                        });
                        setIsEditModalOpen(false);
                        router.navigate({ to: "/admin/coupon", search: { page, limit, search } })
                        editForm.reset();
                    },
                    onError: (error: any) => {
                        toast({
                            title: 'Coupon Update Failed',
                            description: error.response?.data?.message || 'Failed to update coupon',
                            variant: 'destructive',
                        });
                    },
                }
            );
        },
        [selectedCoupon, editCoupon, editForm, toast,page,search]
    );

    const handleEdit = useCallback(
        (coupon: Coupon) => {
            setSelectedCoupon(coupon);
            let expireOnDate: Date;
            if (typeof coupon.expireOn === 'string') {
                expireOnDate = parse(coupon.expireOn, 'MM/dd/yyyy', new Date());
                if (isNaN(expireOnDate.getTime())) {
                    expireOnDate = new Date(coupon.expireOn);
                }
            } else {
                expireOnDate = coupon.expireOn;
            }
            expireOnDate = isNaN(expireOnDate.getTime()) ? new Date() : expireOnDate;

            editForm.reset({
                name: coupon.name,
                offerPrice: coupon.offerPrice,
                min_price: coupon.min_price,
                expireOn: expireOnDate,
            });
            setIsEditModalOpen(true);
        },
        [editForm]
    );

    const handleBlock = async (id: string, isBlocked: boolean) => {
        await editCoupon.mutateAsync(
            { couponId: id, couponData: { isBlocked: !isBlocked } },
            {
                onSuccess: () => {
                    navigate({ to: "/admin/coupon", search: { page, limit, search } });
                    toast({
                        title: "Block Coupon",
                        description: isBlocked ? "Coupon blocked successfully" : "Coupon unblocked successfully",
                    });
                },
                onError: (error: any) => {
                    toast({
                        title: "Block Coupon Failed",
                        description: error.response?.data?.message || "Failed to block/unblock coupon",
                        variant: "destructive",
                    });
                },
            }
        );
    };

    const handleSetSearchTerm = useCallback(
        (term: string) => {
            navigate({ to: "/admin/coupon", search: { page: 1, limit: itemsPerPage, search: term } });
        },
        [navigate, itemsPerPage]
    );

    const handleSetCurrentPage = useCallback(
        (page: number) => {
            navigate({ to: "/admin/coupon", search: { page, limit: itemsPerPage, search: searchTerm } });
        },
        [navigate, itemsPerPage, searchTerm]
    );

    const totalCoupons = data.total || 0;
    const totalPages = Math.ceil(totalCoupons / itemsPerPage);

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-primary mb-6">Coupon Management</h1>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-[50%] grid-cols-2">
                    <TabsTrigger value="coupons">Coupons</TabsTrigger>
                    <TabsTrigger value="add-coupon">Add Coupon</TabsTrigger>
                </TabsList>

                <TabsContent value="coupons">
                    <CouponTable
                        coupons={data.data || []}
                        currentPage={currentPage}
                        onBlock={handleBlock}
                        onEdit={handleEdit}
                        searchTerm={searchTerm}
                        setCurrentPage={handleSetCurrentPage}
                        setSearchTerm={handleSetSearchTerm}
                        totalPages={totalPages}
                    />
                </TabsContent>

                <TabsContent value="add-coupon">
                    <Form {...addForm}>
                        <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-6 max-w-md mx-auto">
                            <FormField
                                control={addForm.control}
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
                                control={addForm.control}
                                name="offerPrice"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-primary">Offer Price</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Enter offer price"
                                                value={field.value || ''}
                                                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={addForm.control}
                                name="min_price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-primary">Minimum Price</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Enter minimum price"
                                                value={field.value || ''}
                                                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={addForm.control}
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
                                                        {field.value && !isNaN(field.value.getTime()) ? (
                                                            format(field.value, 'PPP')
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
                                                    defaultMonth={field.value && !isNaN(field.value.getTime()) ? field.value : new Date()}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={!addForm.formState.isValid}>
                                Add Coupon
                            </Button>
                        </form>
                    </Form>
                </TabsContent>
            </Tabs>

            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent onInteractOutside={(e)=>e.preventDefault()}>
                    <DialogHeader>
                        <DialogTitle>Edit Coupon</DialogTitle>
                    </DialogHeader>
                    <Form {...editForm}>
                        <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-6">
                            <FormField
                                control={editForm.control}
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
                                control={editForm.control}
                                name="offerPrice"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-primary">Offer Price</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Enter offer price"
                                                value={field.value || ''}
                                                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={editForm.control}
                                name="min_price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-primary">Minimum Price</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Enter minimum price"
                                                value={field.value || ''}
                                                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={editForm.control}
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
                                                        {field.value && !isNaN(field.value.getTime()) ? (
                                                            format(field.value, 'PPP')
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
                                                    initialFocus
                                                    defaultMonth={field.value && !isNaN(field.value.getTime()) ? field.value : new Date()}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={!editForm.formState.isValid}>
                                Update Coupon
                            </Button>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CouponManagement;
import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { formatDate } from 'date-fns';
import { CalendarIcon, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks';
import { useNavigate } from '@tanstack/react-router';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Offer } from '@/types/offer';
import { useOfferMutation } from '@/hooks/offers';
import { OfferTable } from './offer-table';
import { router } from '@/router';
import { Category } from '@/types';

interface OfferQueryData {
    data: Offer[];
    total: number;
}

interface OfferManagementProps {
    data: OfferQueryData;
    page: number;
    limit: number;
    search: string;
    total: number;
    categorys: Category[]
}

const formSchema = z.object({
    name: z.string().trim().min(3, 'Name must be at least 3 characters'),
    category: z.string().trim().min(1, 'Category is required'),
    discount: z.number().min(1, 'Discount price must be at least 1'),
    start_date: z.date().refine((date) => date >= new Date(), 'Start date must be today or in the future'),
    end_date: z.date().refine((date) => date > new Date(), 'End date must be in the future'),
    type: z.literal('category'),
});

type FormValues = z.infer<typeof formSchema>;

export const OfferManagement: React.FC<OfferManagementProps> = ({ data, categorys, limit, search, page, total }) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<string>('offers');
    const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
    const { toast } = useToast();
    const { addOffer, editOffer } = useOfferMutation();
    const navigate = useNavigate();
    const itemsPerPage = limit || 5;
    const currentPage = page || 1;
    const searchTerm = search || '';

    console.log("category is: ", categorys)

    const addForm = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        mode: 'onChange',
        defaultValues: {
            name: '',
            category: '',
            discount: 0,
            start_date: new Date(),
            end_date: new Date(),
            type: 'category',
        },
    });

    const editForm = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        mode: 'onChange',
        defaultValues: {
            name: '',
            category: '',
            discount: 0,
            start_date: new Date(),
            end_date: new Date(),
            type: 'category',
        },
    });

    useEffect(() => {
        const checkDates = (form: typeof addForm | typeof editForm) => {
            const { start_date, end_date } = form.getValues();
            if (start_date && end_date && end_date <= start_date) {
                form.setError('end_date', {
                    type: 'manual',
                    message: 'End date must be after start date',
                });
            } else {
                form.clearErrors('end_date');
            }
        };
        checkDates(addForm);
        checkDates(editForm);
    }, [addForm.watch('start_date'), addForm.watch('end_date'), editForm.watch('start_date'), editForm.watch('end_date'), addForm, editForm]);

    const onAddSubmit = async (values: FormValues) => {
        if (values.end_date <= values.start_date) {
            addForm.setError('end_date', {
                type: 'manual',
                message: 'End date must be after start date',
            });
            toast({
                title: 'Invalid Dates',
                description: 'End date must be after start date.',
                variant: 'destructive',
            });
            return;
        }

        await addOffer.mutateAsync(values, {
            onSuccess: () => {
                toast({
                    title: 'Offer Added',
                    description: `Offer ${values.name} has been added successfully.`,
                });
                addForm.reset();
                router.navigate({ to: "/admin/offers", search: { page, limit, search } })
                setActiveTab('offers');

            },
            onError: (error: any) => {
                toast({
                    title: 'Offer create failed',
                    description: error.response?.data?.message || 'Failed to create offer',
                    variant: 'destructive',
                });
            },
        });
    };

    const onEditSubmit = useCallback((values: FormValues) => {
        if (!selectedOffer) return;
        if (values.end_date <= values.start_date) {
            editForm.setError('end_date', {
                type: 'manual',
                message: 'End date must be after start date',
            });
            toast({
                title: 'Invalid Dates',
                description: 'End date must be after start date.',
                variant: 'destructive',
            });
            return;
        }
        editOffer.mutateAsync(
            {
                offerId: selectedOffer._id,
                offerData: {
                    name: values.name,
                    category: values.category,
                    discount: values.discount,
                    start_date: formatDate(values.start_date, 'MM/dd/yyyy'),
                    end_date: formatDate(values.end_date, 'MM/dd/yyyy'),
                    type: values.type,
                },
            },
            {
                onSuccess: () => {
                    toast({
                        title: 'Offer Updated',
                        description: `Offer ${values.name} has been updated successfully.`,
                    });
                    setIsEditModalOpen(false);
                    router.navigate({ to: "/admin/offers", search: { page, limit, search } })
                    editForm.reset();
                },
            }
        );
    }, [selectedOffer, editOffer, editForm, toast]);

    const handleEdit = useCallback((offer: Offer) => {
        setSelectedOffer(offer);
        editForm.reset({
            name: offer.name || '',
            category: offer.category || '',
            discount: offer.discount || 0,
            start_date: new Date(offer.start_date || new Date()),
            end_date: new Date(offer.end_date || new Date()),
            type: 'category',
        });
        setIsEditModalOpen(true);
    }, [editForm]);

    const handleBlock = async (id: string, isBlocked: boolean) => {
        await editOffer.mutateAsync(
            { offerId: id, offerData: { isBlocked: !isBlocked } },
            {
                onSuccess: () => {
                    navigate({ to: '/admin/offers', search: { page, limit, search } });
                    toast({
                        title: 'Block Offer',
                        description: isBlocked ? 'Offer blocked successfully' : 'Offer unblocked successfully',
                    });
                },
            }
        );
    };

    const handleSetSearchTerm = useCallback(
        (term: string) => {
            navigate({ to: '/admin/offers', search: { page: 1, limit: itemsPerPage, search: term } });
        },
        [navigate, itemsPerPage]
    );

    const handleSetCurrentPage = useCallback(
        (page: number) => {
            navigate({ to: '/admin/offers', search: { page, limit: itemsPerPage, search: searchTerm } });
        },
        [navigate, itemsPerPage, searchTerm]
    );

    const totalOffers = total || 0;
    const totalPages = Math.ceil(totalOffers / itemsPerPage);

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-primary mb-6">Offer Management</h1>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-[50%] grid-cols-2">
                    <TabsTrigger value="offers">Offers</TabsTrigger>
                    <TabsTrigger value="add-offer">Add Offer</TabsTrigger>
                </TabsList>



                <TabsContent value="offers">
                    <Input
                        placeholder="Search offers..."
                        value={searchTerm}
                        onChange={(e) => handleSetSearchTerm(e.target.value)}
                        className="max-w-sm"
                    />
                    {data.data && data.data.length > 0 ? (
                        <OfferTable
                            offers={data.data}
                            currentPage={currentPage}
                            onBlock={handleBlock}
                            onEdit={handleEdit}
                            searchTerm={searchTerm}
                            setCurrentPage={handleSetCurrentPage}
                            setSearchTerm={handleSetSearchTerm}
                            totalPages={totalPages}
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center py-10">
                            <AlertCircle className="h-16 w-16 text-gray-400 mb-4" />
                            <h2 className="text-xl font-semibold text-gray-600">No Offers Found</h2>
                            <p className="text-gray-500">Create a new offer to get started.</p>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="add-offer">
                    <Form {...addForm}>
                        <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-6 max-w-md mx-auto">
                            <FormField
                                control={addForm.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-primary">Offer Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter offer name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={addForm.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-primary">Category</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value} disabled={field.disabled}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {
                                                    categorys.map((data)=>(
                                                        <SelectItem value={data.name}>{data.name}</SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={addForm.control}
                                name="discount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-primary">Discount Price</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Enter discount price"
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
                                name="start_date"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel className="text-primary">Start Date</FormLabel>
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
                            <FormField
                                control={addForm.control}
                                name="end_date"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel className="text-primary">End Date</FormLabel>
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
                                                    disabled={(date) => date <= addForm.getValues('start_date')}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={!addForm.formState.isValid}>
                                Add Offer
                            </Button>
                        </form>
                    </Form>
                </TabsContent>
            </Tabs>

            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent onInteractOutside={(e) => e.preventDefault()}>
                    <DialogHeader>
                        <DialogTitle>Edit Offer</DialogTitle>
                    </DialogHeader>
                    <Form {...editForm}>
                        <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-6">
                            <FormField
                                control={editForm.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-primary">Offer Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter offer name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={editForm.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-primary">Category</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value} disabled={field.disabled}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="electronics">Electronics</SelectItem>
                                                <SelectItem value="clothing">Clothing</SelectItem>
                                                <SelectItem value="books">Books</SelectItem>
                                                <SelectItem value="home">Home & Garden</SelectItem>
                                                <SelectItem value="toys">Toys</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={editForm.control}
                                name="discount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-primary">Discount Price</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Enter discount price"
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
                                name="start_date"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel className="text-primary">Start Date</FormLabel>
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
                            <FormField
                                control={editForm.control}
                                name="end_date"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel className="text-primary">End Date</FormLabel>
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
                                                    disabled={(date) => date <= editForm.getValues('start_date')}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={!editForm.formState.isValid}>
                                Update Offer
                            </Button>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
};
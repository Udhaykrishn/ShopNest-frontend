import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PincodeData, IAddressItemProps } from '@/types/address'; 
import { AddressFormData, addressSchema } from '@/schema/address';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAddressMutation } from '@/hooks/address/useAddress';

interface AddressFormProps {
    editingAddress?: IAddressItemProps | null;
    onCancelEdit?: () => void;
}

export function AddressForm({ editingAddress, onCancelEdit }: AddressFormProps) {
    const [pincodeLoading, setPincodeLoading] = useState(false);
    const [pincodeError, setPincodeError] = useState<string | null>(null);
    const [cityOptions, setCityOptions] = useState<string[]>([]);
    const [open, setOpen] = useState(false);
    const { addAddress, updateAddress } = useAddressMutation();

    const form = useForm<AddressFormData>({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            name: "",
            phone: "",
            pincode: "",
            street: "",
            city: "",
            district: "",
            state: "",
            landmark: "",
            type: "",
            country: "India",
        },
        mode: 'onChange',
    });

    useEffect(() => {
        if (editingAddress) {
            form.reset({
                name: editingAddress.name,
                phone: editingAddress.phone,
                pincode: editingAddress.pincode,
                street: editingAddress.street,
                city: editingAddress.city,
                district: editingAddress.district,
                state: editingAddress.state,
                landmark: editingAddress.landmark || "",
                type: editingAddress.type,
                country: editingAddress.country,
            });
            setCityOptions([editingAddress.city]);
        } else {
            form.reset({
                name: "",
                phone: "",
                pincode: "",
                street: "",
                city: "",
                district: "",
                state: "",
                landmark: "",
                type: "",
                country: "India",
            });
            setCityOptions([]);
        }
    }, [editingAddress,form]);

    const fetchAddressFromPincode = async (pincode: string) => {
        if (!/^[1-9][0-9]{5}$/.test(pincode)) {
            setPincodeError("Please enter a valid 6-digit pincode");
            return;
        }

        setPincodeLoading(true);
        setPincodeError(null);

        try {
            const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
            const data = (await response.json()) as PincodeData[];

            if (data?.[0]?.Status === "Success" && data[0].PostOffice?.length > 0) {
                const cities = data[0].PostOffice.map((office) => office.Name);
                const postOffice = data[0].PostOffice[0];
                setCityOptions(cities);

                form.setValue("city", postOffice.Name, { shouldValidate: true });
                form.setValue("district", postOffice.District, { shouldValidate: true });
                form.setValue("state", postOffice.State, { shouldValidate: true });
                form.setValue("country", "India", { shouldValidate: true });
            } else {
                setPincodeError("No location found for this pincode");
                setCityOptions([]);
                form.setValue("city", "");
                form.setValue("district", "");
                form.setValue("state", "");
            }
        } catch (error) {
            setPincodeError("Failed to fetch location data");
            console.error("Pincode lookup error:", error);
        } finally {
            setPincodeLoading(false);
        }
    };

    const handleSubmit = async (data: AddressFormData) => {
        if (editingAddress) {
            await updateAddress.mutateAsync(
                { addressId: editingAddress._id, data },
                {
                    onSuccess: () => {
                        onCancelEdit?.();
                    },
                }
            );
        } else {
            await addAddress.mutateAsync(data, {
                onSuccess: () => {
                    form.reset({
                        name: "",
                        phone: "",
                        pincode: "",
                        street: "",
                        city: "",
                        district: "",
                        state: "",
                        landmark: "",
                        type: "",
                        country: "India",
                    });
                    setCityOptions([]);
                },
            });
        }
    };

    const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 10);
        form.setValue('phone', value, { shouldValidate: true });
    };

    return (
        <div className="bg-gray-100 p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-primary mb-4">
                {editingAddress ? 'Update Address' : 'Add New Address'}
            </h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-primary">Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter name"
                                        {...field}
                                        onChange={(e) => field.onChange(e.target.value.trim())}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Phone */}
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-primary">Phone</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter phone number"
                                        {...field}
                                        onChange={handlePhoneInput}
                                        maxLength={10}
                                        inputMode="numeric"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Address Type */}
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-primary">Address Type</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="e.g., Home, Work"
                                        {...field}
                                        onChange={(e) => field.onChange(e.target.value.trim())}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Pincode */}
                    <FormField
                        control={form.control}
                        name="pincode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-primary">Pincode</FormLabel>
                                <p className="text-xs text-muted-foreground mb-1">
                                    <strong>Enter your 6-digit pincode and click Check Pincode to fetch location details.</strong>
                                </p>
                                <FormControl>
                                    <div className="flex space-x-2">
                                        <div className="relative flex-1">
                                            <Input
                                                placeholder="Enter 6-digit pincode"
                                                maxLength={6}
                                                {...field}
                                                onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
                                            />
                                            {pincodeLoading && (
                                                <div className="absolute right-2 top-2">
                                                    <div className="h-5 w-5 border-t-2 border-primary rounded-full animate-spin"></div>
                                                </div>
                                            )}
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => fetchAddressFromPincode(field.value)}
                                            disabled={pincodeLoading || field.value.length !== 6}
                                        >
                                            Check Pincode
                                        </Button>
                                    </div>
                                </FormControl>
                                {pincodeError && (
                                    <p className="text-orange-500 text-sm mt-1">{pincodeError}</p>
                                )}
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Street */}
                    <FormField
                        control={form.control}
                        name="street"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-primary">Address Line:</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter address line"
                                        {...field}
                                        onChange={(e) => field.onChange(e.target.value)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Landmark */}
                    <FormField
                        control={form.control}
                        name="landmark"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-primary">Landmark</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter landmark (optional)" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* City (with Search and Scroll) */}
                    <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-primary">City</FormLabel>
                                <Popover open={open} onOpenChange={setOpen}>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className={cn(
                                                    "w-full justify-between bg-gray-50",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                                disabled={pincodeLoading || cityOptions.length === 0}
                                            >
                                                {field.value
                                                    ? cityOptions.find((city) => city === field.value)
                                                    : "Enter pincode to get city"}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0">
                                        <Command>
                                            <CommandInput placeholder="Search city..." />
                                            <CommandEmpty>No city found.</CommandEmpty>
                                            <CommandGroup className="max-h-60 overflow-y-auto">
                                                {cityOptions.map((city) => (
                                                    <CommandItem
                                                        key={city}
                                                        value={city}
                                                        onSelect={() => {
                                                            form.setValue("city", city);
                                                            setOpen(false);
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                city === field.value ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                        {city}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* District */}
                    <FormField
                        control={form.control}
                        name="district"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-primary">District</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="District"
                                        {...field}
                                        readOnly={pincodeLoading}
                                        className={field.value ? "bg-gray-50" : ""}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* State */}
                    <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-primary">State</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="State"
                                        {...field}
                                        readOnly={pincodeLoading}
                                        className={field.value ? "bg-gray-50" : ""}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Country */}
                    <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-primary">Country</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Country"
                                        {...field}
                                        readOnly
                                        className="bg-gray-50"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Submit and Cancel Buttons */}
                    <div className="flex space-x-2">
                        <Button
                            type="submit"
                            className="w-full text-white font-medium py-2 px-6 rounded-lg transition-all duration-200 ease-in-out shadow-md hover:shadow-lg"
                            disabled={
                                addAddress.isPending ||
                                updateAddress.isPending ||
                                !form.formState.isValid
                            }
                        >
                            {editingAddress ? (
                                <>
                                    {updateAddress.isPending && <Loader2 className="animate-spin mr-2" />}
                                    Update Address
                                </>
                            ) : (
                                <>
                                    {addAddress.isPending && <Loader2 className="animate-spin mr-2" />}
                                    Add Address
                                </>
                            )}
                        </Button>
                        {editingAddress && (
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                onClick={onCancelEdit}
                                disabled={updateAddress.isPending}
                            >
                                Cancel
                            </Button>
                        )}
                    </div>
                </form>
            </Form>
        </div>
    );
}
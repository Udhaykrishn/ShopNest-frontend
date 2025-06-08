
import { z } from 'zod';

export const addressSchema = z.object({
  name: z.string()
    .min(1, "Name is required")
    .trim()
    .refine(val => val.length > 0, "Name cannot be just spaces"),
  phone: z.string()
    .regex(/^\d{10}$/, "Phone must be exactly 10 digits")
    .transform(val => val.slice(0, 10)),
  pincode: z.string()
    .regex(/^[1-9][0-9]{5}$/, "Pincode must be 6 digits, starting with 1-9"),
  street: z.string()
    .min(1, "Address line is required")
    .trim()
    .refine(val => val.length > 0, "Address cannot be just spaces"),
  city: z.string()
    .min(1, "City is required"),
  district: z.string()
    .min(1, "District is required"),
  state: z.string()
    .min(1, "State is required"),
  landmark: z.string()
    .optional(),
  type: z.string()
    .min(1, "Address type is required")
    .trim()
    .refine(val => val.length > 0, "Type cannot be just spaces"),
  country: z.string()
    .min(1, "Country is required"),
});

export type AddressFormData = z.infer<typeof addressSchema>;
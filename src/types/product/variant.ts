import { z } from "zod";

const normalizePrice = (value: string): string => {
    let cleaned = value.replace(/[^\d.,]/g, "");
    cleaned = cleaned.replace(/(\.|,)(?=.*(\.|,))/g, "");
    cleaned = cleaned.replace(/,/g, ".");
    return cleaned;
};

export const variantValueSchema = z.object({
    value: z.string().min(1, "Value is required"),
    price: z.string()
        .min(1, "Regular price is required")
        .regex(
            /^\d{1,3}(?:[.,]?\d{3})*(?:[.,]\d{1,2})?$/,
            "Invalid regular price format (e.g., 123.45, 1,234.56, or 1234,56)"
        )
        .transform(normalizePrice)
        .refine((val) => val && !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
            message: "Regular price must be greater than zero",
            path: ["regularPrice"],
        })
        .refine((val) => val && parseFloat(val) >= 100, {
            message: "Regular price must be at least 100",
            path: ["regularPrice"],
        }),
    offeredPrice: z.string()
        .min(1, "Offered price is required")
        .regex(
            /^\d{1,3}(?:[.,]?\d{3})*(?:[.,]\d{1,2})?$/,
            "Invalid offered price format (e.g., 12.34, 1,234.56, or 1234,56)"
        )
        .transform(normalizePrice)
        .refine((val) => val && !isNaN(parseFloat(val)), {
            message: "Offered price must be greater than zero",
            path: ["offeredPrice"],
        })
        .refine((val) => val && parseFloat(val) >= 10, {
            message: "Offered price must be at least 10",
            path: ["offeredPrice"],
        }),
    stock: z.coerce.number()
        .refine((value) => value >= 0, {
            message: "Can't add negative numbers",
            path: ["stock"]
        })
        .refine((val) => val <= 1000, {
            message: "Reached maximum limit of stock",
            path: ["stock"],
        }),


    sku: z.string().optional(),
}).refine((data) => parseFloat(data.offeredPrice) < parseFloat(data.price), {
    message: "Offered price must be less than regular price",
    path: ["offeredPrice"],
});

export const variantSchema = z.object({
    _id:z.string(),
    type: z.string().min(1, "Variant type is required"),
    values: z.array(variantValueSchema).min(1, "At least one value is required"),
});

export const productSchema = z.object({
    name: z.string().min(1, "Product name is required"),
    brand: z.string().min(1, "Brand is required"),
    description: z.string().min(1, "Description is required"),
    category: z.string().min(1, "Category is required"),
    subcategory: z.string().optional(),
    images: z.array(
        z.object({
            id: z.string(),
            url: z.string(),
            path: z.string().optional(),
            file: z.instanceof(File).optional().nullable(),
            isUploading: z.boolean(),
            isUploaded: z.boolean(),
        })
    ).min(3, "At least 3 images are required"),
    variants: z.array(variantSchema).min(1, "At least one variant is required"),
});

export type productForm = z.infer<typeof productSchema>;
export type VariantForm = z.infer<typeof variantSchema>;
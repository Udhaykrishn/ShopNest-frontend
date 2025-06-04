import React from "react";
import { UseFormReturn } from "react-hook-form";
import { productForm } from "@/types/product";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DescriptionInputWithModal } from "./description-model";

interface BasicInfoFormProps {
  form: UseFormReturn<productForm>;
  categories: { [key: string]: string[] };
  onClearDescription: () => void;
}

export const BasicInfoForm: React.FC<BasicInfoFormProps> = ({
  form,
  categories,
  onClearDescription,
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Basic Information</h3>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Product Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter product name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="brand"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Brand</FormLabel>
            <FormControl>
              <Input placeholder="Enter brand name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <DescriptionInputWithModal form={form} onClear={onClearDescription} />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  form.setValue("subcategory", "", { shouldValidate: true });
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
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
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subcategory (Optional)</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={!form.watch("category")}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select subcategory" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {form.watch("category") && categories[form.watch("category")]?.length > 0 ? (
                    categories[form.watch("category")].map((sub) => (
                      <SelectItem key={sub} value={sub}>
                        {sub.charAt(0).toUpperCase() + sub.slice(1)}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      No subcategories available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
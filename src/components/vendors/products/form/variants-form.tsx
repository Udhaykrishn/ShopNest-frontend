import React from "react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { productForm } from "@/types/product";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { VariantValuesForm } from "./vaiant-value-form";

interface VariantsFormProps {
  form: UseFormReturn<productForm>;
}

export const VariantsForm: React.FC<VariantsFormProps> = ({ form }) => {
  const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Variants</h3>
      <div>
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            appendVariant({
              _id:"",
              type: "",
              values: [
                {
                  value: "",
                  price: "",
                  offeredPrice: "",
                  stock: 0,
                  sku: "",
                },
              ],
            })
          }
        >
          Add Variant Type
        </Button>
      </div>
      {variantFields.map((variant, index) => (
        <div key={variant.id} className="border p-4 rounded-md space-y-4">
          <FormField
            control={form.control}
            name={`variants.${index}.type`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Variant Type (e.g., RAM, SIZE, COLOR)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter variant type"
                    onChange={(e) => field.onChange(e.target.value.trim())}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <h4 className="text-sm font-medium">Variant Values</h4>
            <VariantValuesForm index={index} form={form} />
          </div>
          <Button
            type="button"
            variant="destructive"
            onClick={() => removeVariant(index)}
          >
            Remove Variant
          </Button>
        </div>
      ))}
    </div>
  );
};
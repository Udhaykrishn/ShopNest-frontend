import React from "react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { productForm } from "@/types/product";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PriceInputGroup } from "./price-input-group";

interface VariantValuesFormProps {
  index: number;
  form: UseFormReturn<productForm>;
}

export const VariantValuesForm: React.FC<VariantValuesFormProps> = ({ index, form }) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `variants.${index}.values`,
  });

  const restrictStockInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (["e", "E", "+", "-", "."].includes(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <div className="space-y-2">
      {fields.map((value, valueIndex) => (
        <div key={value.id} className="flex space-x-2 items-start">
          <FormField
            control={form.control}
            name={`variants.${index}.values.${valueIndex}.value`}
            rules={{ required: "Value is required" }}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Value</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="e.g., 8GB, M, Red"
                    onChange={(e) => field.onChange(e.target.value.trim())}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <PriceInputGroup
            form={form}
            price={`variants.${index}.values.${valueIndex}.price`}
            offeredName={`variants.${index}.values.${valueIndex}.offeredPrice`}
          />
          <FormField
            control={form.control}
            name={`variants.${index}.values.${valueIndex}.stock`}
            rules={{
              required: "Stock is required",
              pattern: {
                value: /^\d+$/,
                message: "Invalid stock (must be a whole number)",
              },
              validate: {
                notZero: (value: number) => value > 0 || "Stock cannot be zero",
                minValue: (value: number) => value >= 2 || "Stock must be at least 2",
                maxValue: (value: number) => value <= 1000 || "Reached maximum limit of stock",
              },
            }}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min={0}
                    max={1000}
                    placeholder="e.g., 10"
                    onKeyDown={restrictStockInput}
                    onChange={(e) => {
                      console.log(typeof e.target.value)
                      field.onChange(Number(e.target.value));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="button"
            variant="destructive"
            onClick={() => remove(valueIndex)}
            className="mt-8"
          >
            Remove
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={() =>
          append({
            value: "",
            price: "",
            offeredPrice: "",
            stock: 0,
            sku: "",
          })
        }
      >
        Add Value
      </Button>
    </div>
  );
};
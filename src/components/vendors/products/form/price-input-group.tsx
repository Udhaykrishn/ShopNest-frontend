import React from "react";
import { UseFormReturn } from "react-hook-form";
import { productForm } from "@/types/product";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { NumericFormat } from "react-number-format";

interface PriceInputGroupProps {
  form: UseFormReturn<productForm>;
  price: `variants.${number}.values.${number}.price`;
  offeredName: `variants.${number}.values.${number}.offeredPrice`;
}

export const PriceInputGroup: React.FC<PriceInputGroupProps> = ({ form, price, offeredName }) => {
  return (
    <>
      <FormField
        control={form.control}
        name={price}
        rules={{
          required: "Regular price is required",
          pattern: {
            value: /^\d{1,3}(?:[.,]?\d{3})*(?:[.,]\d{1,2})?$/,
            message: "Invalid regular price format (e.g., 123.45, 1,234.56)",
          },
          validate: {
            notZero: (value) => parseFloat(value || "0") > 0 || "Regular price cannot be zero",
            minValue: (value) => parseFloat(value || "0") >= 100 || "Regular price must be at least 100",
          },
        }}
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormLabel>Regular Price</FormLabel>
            <FormControl>
              <NumericFormat
                customInput={Input}
                {...field}
                placeholder="e.g., 123.45 or 1,234.56"
                thousandSeparator=","
                decimalScale={2}
                fixedDecimalScale
                allowNegative={false}
                value={field.value || ""}
                onValueChange={(values) => {
                  field.onChange(values.value);
                  form.trigger(offeredName);
                }}
                isAllowed={(values) => {
                  const { value } = values;
                  return !value || /^\d*\.?\d{0,2}$/.test(value);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={offeredName}
        rules={{
          required: "Offered price is required",
          pattern: {
            value: /^\d{1,3}(?:[.,]?\d{3})*(?:[.,]\d{1,2})?$/,
            message: "Invalid offered price format (e.g., 12.34, 1,234.56)",
          },
          validate: {
            notZero: (value) => parseFloat(value || "0") > 0 || "Offered price cannot be zero",
            minValue: (value) => parseFloat(value || "0") >= 10 || "Offered price must be at least 10",
            lessThanRegular: (value) => {
              const regularPrice = form.getValues(price);
              return (
                !regularPrice ||
                !value ||
                parseFloat(value) < parseFloat(regularPrice) ||
                "Offered price must be less than regular price"
              );
            },
          },
        }}
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormLabel>Offered Price</FormLabel>
            <FormControl>
              <NumericFormat
                customInput={Input}
                {...field}
                placeholder="e.g., 12.34 or 1,234.56"
                thousandSeparator=","
                decimalScale={2}
                fixedDecimalScale
                allowNegative={false}
                value={field.value || ""}
                onValueChange={(values) => {
                  field.onChange(values.value);
                  form.trigger(price);
                }}
                isAllowed={(values) => {
                  const { value } = values;
                  return !value || /^\d*\.?\d{0,2}$/.test(value);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
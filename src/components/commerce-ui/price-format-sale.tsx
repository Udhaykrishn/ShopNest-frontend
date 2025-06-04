"use client";

import { cn } from "@/lib/utils";
import { NumericFormat } from "react-number-format";

interface PriceFormat_SaleProps extends React.HTMLAttributes<HTMLDivElement> {
  originalPrice: number;
  salePrice: number;
  prefix?: string;
  thousandSeparator?: string;
  decimalSeparator?: string;
  decimalScale?: number;
  showSavePercentage?: boolean;
  classNameOriginalPrice?: string;
  classNameSalePrice?: string;
  classNameSalePercentage?: string;
}

const PriceFormat_Sale: React.FC<PriceFormat_SaleProps> = ({
  className,
  classNameOriginalPrice,
  classNameSalePercentage,
  classNameSalePrice,
  decimalSeparator = ",",
  originalPrice,
  prefix = "₹",
  salePrice,
  showSavePercentage = false,
}) => {
  const savePercentage = ((originalPrice - salePrice) / originalPrice) * 100;

  const formatIndianPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);


  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <NumericFormat
        value={formatIndianPrice(originalPrice)}
        decimalSeparator={decimalSeparator}
        prefix={prefix}
        displayType="text"
        className={cn(
          "font-medium text-gray-500 line-through",
          classNameOriginalPrice
        )}
      />
      <NumericFormat
        value={formatIndianPrice(salePrice)}
        decimalSeparator={decimalSeparator}
        prefix={prefix}
        displayType="text"
        className={cn("text-[length:inherit] font-medium", classNameSalePrice)}
      />
      {showSavePercentage && (
        <span
          className={cn(
            "rounded-sm bg-green-500/50 p-1 text-sm font-medium",
            classNameSalePercentage
          )}
        >
          Save {Math.round(savePercentage)}%
        </span>
      )}
    </div>
  );
};

export default PriceFormat_Sale;

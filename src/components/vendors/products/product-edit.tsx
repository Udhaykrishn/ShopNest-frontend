import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast, useAllCategories, useProductMutations } from "@/hooks";
import { productSchema, productForm } from "@/types/product";
import { Product } from "@/types";
import { BasicInfoForm } from "./form/basic-info";
import { VariantsForm } from "./form/variants-form";
import { ImagesForm } from "./form/image-form";
import { handleSaveAllImages } from "@/utils/handle-save-images";
import { router } from "@/router";

interface ProductEditFormProps {
  product: Product;
}

export const ProductEditForm: React.FC<ProductEditFormProps> = ({ product }) => {
  const { data: categoryData } = useAllCategories();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [, setFormIsDirty] = useState<boolean>(false);
  const { updateProduct } = useProductMutations();

  const form = useForm<productForm>({
    resolver: zodResolver(productSchema),
    defaultValues: getInitialFormData(product),
    mode: "onChange",
  });

  const handleClearDescription = () => {
    form.setValue("description", "", { shouldValidate: true, shouldDirty: true });
    setFormIsDirty(true);
    toast({ title: "Cleared", description: "Description has been cleared." });
  };

  const categories: { [key: string]: string[] } =
    categoryData?.data?.reduce(
      (acc: { [key: string]: string[] }, item: { name: string; subCategory: string[] }) => {
        acc[item.name] = item.subCategory;
        return acc;
      },
      {}
    ) || {};

  const onSubmit = async (data: productForm) => {
    try {
      const isValid = await form.trigger();
      if (!isValid) {
        console.log("onSubmit - Validation failed:", form.formState.errors);
        toast({
          title: "Validation error",
          description: "Please fix the errors in the form before submitting.",
          variant: "destructive",
        });
        return;
      }

      const hasUnsavedImages = data.images.some((img) => !img.isUploaded);
      if (hasUnsavedImages) {
        console.log("onSubmit - Saving unsaved images");
        await handleSaveAllImages({ setIsSaving, form, toast, setFormIsDirty });
      }

      const uploadedImages = form
        .getValues("images")
        .filter((img) => img.isUploaded)
        .map((img) => img.url);

      const finalData: Partial<Product> = {
        ...data,
        images: uploadedImages,
        variants: data.variants.map((variant) => ({
          _id:variant._id,
          type:variant.type,
          values: variant.values.map((value) => ({
            ...value,
            stock:Number(value.stock),
            price: parseFloat(value.price),
            offeredPrice: parseFloat(value.offeredPrice),
          })),
        })),
      };

      await updateProduct.mutateAsync({ productId: product._id, productData: finalData },{
        onSuccess:()=>{
            router.load();
        }
      });

      form.reset(getInitialFormData(product));
      setFormIsDirty(false); 
      toast({
        title: "Product Updated",
        description: "The product has been successfully updated.",
        variant: "default",
      });
    } catch (error: any) {
      console.log("onSubmit - Error:", error);
      toast({
        title: "Error updating product",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const imageCount = form.watch("images")?.length || 0;
  const uploadedImageCount = form.watch("images")?.filter((img) => img.isUploaded).length || 0;

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Product</CardTitle>
        <CardDescription>Update the details of the product.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="space-y-6"
            onSubmit={(e) => {
              console.log("Form - Submit event triggered");
              form.handleSubmit(onSubmit)(e);
            }}
          >
            <BasicInfoForm
              form={form}
              categories={categories}
              onClearDescription={handleClearDescription}
            />
            <VariantsForm form={form} />
            <ImagesForm
              form={form}
              imageCount={imageCount}
              uploadedImageCount={uploadedImageCount}
              isSubmitting={updateProduct.isPending}
              getInitialFormData={() => getInitialFormData(product)}
              isSaving={isSaving}
              setIsSaving={setIsSaving}
              setFormIsDirty={setFormIsDirty} // Pass setFormIsDirty
            />
            <Button type="submit" className="w-full" disabled={updateProduct.isPending}>
              {updateProduct.isPending ? (
                <>
                  <Loader2 className="animate-spin inline-block mr-2" />
                  Updating Product...
                </>
              ) : (
                "Update Product"
              )}
            </Button>
            {/* Debug button to check form state */}
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                console.log("Form state:", {
                  isDirty: form.formState.isDirty,
                  errors: form.formState.errors,
                  images: form.getValues("images"),
                });
              }}
            >
              Log Form State
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

const getInitialFormData = (product: Product): productForm => {
  const categoryName =
    typeof product.category === "string" ? product.category : product.category.name || "";
  const subcategory = product.subCategory || product.subcategory || "";

  return {
    name: product.name || "",
    brand: product.brand || "",
    description: product.description || "",
    category: categoryName,
    subcategory: subcategory,
    images: product.images.map((url, index) => ({
      id: `img-${index}`,
      url,
      isUploaded: true,
      isUploading: false,
    })),
    variants: product.variants.map((variant) => ({
      _id:variant._id,
      type: variant.type,
      values: variant.values.map((value) => ({
        value: value.value,
        price: value.price.toString(),
        offeredPrice: value.offeredPrice.toString(),
        stock: value.stock,
        sku: value.sku || "",
      })),
    })),
  };
};
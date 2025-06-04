import React, { useState, useEffect } from "react";
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
import { useVendorAuthStore } from "@/stores/vendor/vendorAuthStore";
import { productSchema, productForm } from "@/types/product";
import { handleSaveAllImages } from "@/utils/handle-save-images";
import { BasicInfoForm } from "./form/basic-info";
import { VariantsForm } from "./form/variants-form";
import { ImagesForm } from "./form/image-form";

const FORM_STORAGE_KEY = "productFormData";

export const ProductForm: React.FC = () => {
  const { data: categoryData } = useAllCategories();
  const { toast } = useToast();
  const [, setFormIsDirty] = useState<boolean>(false); // Fix unused variable
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const { createProduct } = useProductMutations();
  const { vendor } = useVendorAuthStore();

  const form = useForm<productForm>({
    resolver: zodResolver(productSchema),
    defaultValues: getInitialFormData(),
    mode: "onChange",
  });

  const handleClearDescription = () => {
    form.setValue("description", "", { shouldValidate: true, shouldDirty: true });
    setFormIsDirty(true);
    toast({ title: "Cleared", description: "Description has been cleared." });
  };

  useEffect(() => {
    const subscription = form.watch((value) => {
      const dataToSave = {
        ...value,
        images: value.images?.map((img) => ({
          id: img?.id,
          url: img?.url,
          isUploaded: img?.isUploaded,
          isUploading: img?.isUploading,
        })) || [],
      };
      localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(dataToSave));
      setFormIsDirty(true);
    });
    return () => subscription.unsubscribe();
  }, [form]);

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
        toast({
          title: "Validation error",
          description: "Please fix the errors in the form before submitting.",
          variant: "destructive",
        });
        return;
      }

      const hasUnsavedImages = data.images.some((img) => !img.isUploaded);
      if (hasUnsavedImages) {
        await handleSaveAllImages({ setIsSaving, form, toast, setFormIsDirty });
      }

      const uploadedImages = form
        .getValues("images")
        .filter((img) => img.isUploaded)
        .map(({ url }) => ({ url }));

      const finalData = {
        ...data,
        images: uploadedImages,
        variants: data.variants.map((variant) => ({
          type: variant.type,
          values: variant.values.map((value) => ({
            ...value,
            stock:Number(value.stock),
            price: parseFloat(value.price),
            offeredPrice: parseFloat(value.offeredPrice),
          })),
        })),
      };

      await createProduct.mutateAsync({ id: vendor?.id as string, payload: finalData });

      localStorage.removeItem(FORM_STORAGE_KEY);
      form.reset(getInitialFormData());
      setFormIsDirty(false);
      toast({
        title: "Product Added",
        description: "The product has been successfully added.",
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Error creating product",
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
        <CardTitle>Add New Product</CardTitle>
        <CardDescription>
          Fill in the details to add a new product to the catalog.
        </CardDescription>
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
              isSubmitting={createProduct.isPending}
              setFormIsDirty={setFormIsDirty}
              getInitialFormData={getInitialFormData}
              isSaving={isSaving}
              setIsSaving={setIsSaving}
            />
            <Button type="submit" className="w-full" disabled={createProduct.isPending}>
              {createProduct.isPending ? (
                <>
                  <Loader2 className="animate-spin inline-block mr-2" />
                  Adding Product...
                </>
              ) : (
                "Add Product"
              )}
            </Button>
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

const getInitialFormData = (): productForm => {
  const savedData = localStorage.getItem(FORM_STORAGE_KEY);
  if (savedData) {
    const parsedData = JSON.parse(savedData);
    const images = parsedData.images.map((img: any) => ({
      ...img,
      file: undefined,
    }));
    return { ...parsedData, images };
  }
  return {
    name: "",
    brand: "",
    description: "",
    category: "",
    subcategory: "",
    images: [],
    variants: [],
  };
};
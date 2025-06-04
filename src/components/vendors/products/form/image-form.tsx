import React from "react";
import { UseFormReturn } from "react-hook-form";
import { productForm, ProductImage } from "@/types/product";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "../image-uploader";
import { useToast } from "@/hooks";
import { handleSaveAllImages } from "@/utils/handle-save-images";

interface ImagesFormProps {
  form: UseFormReturn<productForm>;
  imageCount: number;
  uploadedImageCount: number;
  isSubmitting: boolean;
  setFormIsDirty: (data: boolean) => void;
  getInitialFormData: () => productForm;
  isSaving: boolean;
  setIsSaving: (isSaving: boolean) => void;
}

export const ImagesForm: React.FC<ImagesFormProps> = ({
  form,
  imageCount,
  uploadedImageCount,
  isSubmitting,
  setFormIsDirty,
  isSaving,
  setIsSaving,
}) => {
  const showSaveAllButton = imageCount >= 3 && uploadedImageCount < imageCount;
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Product Images</h3>
      <FormField
        control={form.control}
        name="images"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Product Images</FormLabel>
            <ImageUploader
              images={(field.value || []) as ProductImage[]}
              onChange={(newImages: ProductImage[]) => {
                // Use form.setValue to mark the images field as dirty
                form.setValue("images", newImages, { shouldValidate: true, shouldDirty: true });
                // Update form dirty state (for parent component)
                setFormIsDirty(true);
                console.log("ImagesForm - Updated images:", newImages);
                console.log("ImagesForm - Is form dirty?", form.formState.isDirty);
              }}
              maxImages={10}
              minImages={3}
            />
            {imageCount < 3 && (
              <p className="text-sm text-red-500 mt-2">Please upload at least 3 images</p>
            )}
            {uploadedImageCount >= 3 && (
              <p className="text-sm text-green-500 mt-2">Latest 3 images uploaded successfully</p>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="text-sm text-gray-500 mt-2">
        Upload at least 3 images and use the "Save Images" button to save them all at once.
      </div>
      {showSaveAllButton && (
        <Button
          type="button"
          variant="secondary"
          className="w-full mt-4"
          onClick={() => handleSaveAllImages({ setIsSaving, form, toast, setFormIsDirty })}
          disabled={isSaving || isSubmitting}
        >
          {isSaving ? "Saving Images..." : "Save Images"}
        </Button>
      )}
    </div>
  );
};
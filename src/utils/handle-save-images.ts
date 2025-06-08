import { uploadToSupabase } from "./file-upload";

type HandleSaveImagesProps = {
  setIsSaving: (value: boolean) => void;
  form: any;
  toast: (value: Record<string, unknown>) => void;
  setFormIsDirty: (data: boolean) => void; // Add setFormIsDirty
};

export const handleSaveAllImages = async ({
  setIsSaving,
  form,
  toast,
  setFormIsDirty,
}: HandleSaveImagesProps) => {
  try {
    setIsSaving(true);
    const images = form.getValues("images") || [];
    const unsavedImages = images.filter((img) => !img.isUploaded && img.file);

    if (unsavedImages.length === 0) {
      console.log("No unsaved images to upload.");
      toast({
        title: "No images to save",
        description: "All images are already saved.",
        variant: "default",
      });
      return;
    }

    const allowedMimeTypes = ["image/png", "image/jpeg", "image/jpg"];
    unsavedImages.forEach((img) => {
      const fileType = img.file!.type.toLowerCase();
      if (!allowedMimeTypes.includes(fileType)) {
        throw new Error(
          `Invalid file type for ${img.file!.name}. Only PNG, JPG, and JPEG are supported.`
        );
      }
    });

    const uploadPromises = unsavedImages.map((img) => uploadToSupabase(img.file!));
    const uploadedResults = await Promise.all(uploadPromises);

    const updatedImages = images.map((img) => {
      if (img.isUploaded) return img;
      const uploadedImage = uploadedResults.shift();
      return uploadedImage
        ? {
            ...img,
            url: uploadedImage.url,
            path: uploadedImage.path,
            isUploaded: true,
          }
        : img;
    });

    form.setValue("images", updatedImages, { shouldValidate: true, shouldDirty: true });
    setFormIsDirty(true); // Mark parent component as dirty
    console.log("handleSaveAllImages - Updated images:", updatedImages);
    console.log("handleSaveAllImages - Is form dirty?", form.formState.isDirty);
    toast({
      title: "Images saved",
      description: "All images have been successfully uploaded.",
      variant: "default",
    });
  } catch (error: any) {
    toast({
      title: "Error uploading images",
      description: error.message,
      variant: "destructive",
    });
  } finally {
    setIsSaving(false);
  }
};
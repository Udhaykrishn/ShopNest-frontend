import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import 'react-image-crop/dist/ReactCrop.css';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { CropDialog } from '../crop-dialog';

interface ProductImage {
  id: string;
  url: string;
  file?: File;
}

interface FormData {
  name: string;
  description: string;
  brand: string;
  category: string;
  subcategory: string;
  images: ProductImage[];
}

interface CloudinaryUploadResponse {
  public_id: string;
  secure_url: string;
}

const uploadToCloudinary = async (file: File): Promise<CloudinaryUploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch(`https://api.cloudinary.com/v1_1/your-cloud-name/image/upload`, {
    method: 'POST',
    body: formData
  });
  if (!response.ok) throw new Error('Upload failed');
  return response.json();
};

const ImageUploadForm = () => {
  const form = useForm<FormData>({
    defaultValues: {
      name: '',
      description: '',
      brand: '',
      category: '',
      subcategory: '',
      images: []
    }
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [cropDialogData, setCropDialogData] = useState<{
    isOpen: boolean;
    imageUrl: string;
    originalFile?: File;
  }>({
    isOpen: false,
    imageUrl: ''
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsUploading(true);
      await Promise.all(
        data.images.map(async (image) => {
          if (!image.file) throw new Error(`No file found for image ${image.id}`);
          return await uploadToCloudinary(image.file);
        })
      );
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const openCropDialog = (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setCropDialogData({
      isOpen: true,
      imageUrl,
      originalFile: file
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      openCropDialog(files[0]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCropComplete = (croppedFile: File) => {
    const newImage: ProductImage = {
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(croppedFile),
      file: croppedFile
    };
    const currentImages = form.getValues('images') || [];
    const updatedImages = [...currentImages, newImage].slice(0, 5);
    form.setValue('images', updatedImages, { shouldValidate: true });
    setCropDialogData({ isOpen: false, imageUrl: '' });
  };

  const handleImageRemove = (id: string) => {
    const currentImages = form.getValues('images');
    const updatedImages = currentImages.filter(img => img.id !== id);
    form.setValue('images', updatedImages, { shouldValidate: true });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      openCropDialog(files[0]);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Add New Product</CardTitle>
        <CardDescription>Fill in the details to add a new product to the catalog.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="images"
                rules={{ required: 'At least 3 images are required' }}
                render={() => (
                  <FormItem>
                    <FormLabel>Product Images</FormLabel>
                    <div
                      className={`border-2 border-dashed rounded-lg p-6 text-center ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleUploadClick}
                          disabled={isUploading}
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Images
                        </Button>
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        Upload images one by one. Each image can be cropped before adding. (Minimum 3 images required)
                      </p>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {form.watch('images')?.map((image: ProductImage) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.url}
                      alt="Product preview"
                      className="w-full h-40 object-cover rounded-lg select-none pointer-events-none"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => handleImageRemove(image.id)}
                      className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      disabled={isUploading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isUploading}>
              {isUploading ? 'Uploading...' : 'Add Product'}
            </Button>
          </form>
        </Form>
        <CropDialog
          isOpen={cropDialogData.isOpen}
          onClose={() => setCropDialogData({ isOpen: false, imageUrl: '' })}
          imageUrl={cropDialogData.imageUrl}
          onCropComplete={handleCropComplete}
        />
      </CardContent>
    </Card>
  );
};

export default ImageUploadForm;
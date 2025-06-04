import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { useRef } from 'react';

interface ProductImage {
    id: string;
    url: string;
    file?: File;
}

interface ImageUploadProps {
    form: UseFormReturn;
    onImageSelect: (file: File) => void;
    onImageRemove: (id: string) => void;
    isDragging: boolean;
    onDragOver: (e: React.DragEvent) => void;
    onDragLeave: () => void;
    onDrop: (e: React.DragEvent) => void;
}

export const ImageUpload = ({
    form,
    onImageSelect,
    onImageRemove,
    isDragging,
    onDragOver,
    onDragLeave,
    onDrop
}: ImageUploadProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            onImageSelect(files[0]);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-4">
            <FormField
                control={form.control}
                name="images"
                rules={{ required: 'At least 3 images are required' }}
                render={() => (
                    <FormItem>
                        <FormLabel>Product Images</FormLabel>
                        <div
                            className={`border-2 border-dashed rounded-lg p-6 text-center ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                                }`}
                            onDragOver={onDragOver}
                            onDragLeave={onDragLeave}
                            onDrop={onDrop}
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
                                >
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload Images
                                </Button>
                            </div>
                            <p className="mt-2 text-sm text-gray-500">
                                Upload images one by one. Each image can be cropped before adding.
                                (Minimum 3 images required)
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
                            onClick={() => onImageRemove(image.id)}
                            className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
};
import React, { useState } from "react";
import { CropDialog } from "./crop-dialog";

export interface ProductImage {
    id: string;
    url: string;
    file?: File; 
    isUploaded: boolean;
    isUploading: boolean;
}

interface ImageUploaderProps {
    images: ProductImage[];
    onChange: (images: ProductImage[]) => void;
    maxImages?: number;
    minImages?: number;
    aspectRatio?: number;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
    images = [],
    onChange,
    maxImages = 10,
    minImages = 3,
    aspectRatio = 1,
}) => {
    const [cropDialogData, setCropDialogData] = useState<{
        isOpen: boolean;
        imageUrl: string;
        originalFile?: File;
    }>({
        isOpen: false,
        imageUrl: "",
    });

    const allowedMimeTypes = ["image/png", "image/jpg", "image/jpeg"];

    const handleFileSelect = (file: File) => {
        console.log("Selected File Details:", {
            name: file.name,
            type: file.type,
            size: file.size,
            lastModified: file.lastModified,
        });

        if (images.length >= maxImages) {
            alert(`Maximum ${maxImages} images allowed`);
            return;
        }
        if (allowedMimeTypes.includes(file.type.toLowerCase())) {
            openCropDialog(file);
        } else {
            alert("Please select a valid image file (PNG, JPG, or JPEG only)");
        }
    };

    const openCropDialog = (file: File) => {
        const imageUrl = URL.createObjectURL(file);
        setCropDialogData({
            isOpen: true,
            imageUrl,
            originalFile: file,
        });
    };

    const handleCropComplete = (croppedFile: File) => {
        console.log("Cropped File Details:", {
            name: croppedFile.name,
            type: croppedFile.type,
            size: croppedFile.size,
            lastModified: croppedFile.lastModified,
        });

        const newImage: ProductImage = {
            id: Math.random().toString(36).substring(2, 9),
            url: URL.createObjectURL(croppedFile),
            file: croppedFile,
            isUploaded: false,
            isUploading: false,
        };

        console.log("newImage is: ", newImage);

        const updatedImages = [...images, newImage].slice(0, maxImages);
        onChange(updatedImages);

        setCropDialogData({ isOpen: false, imageUrl: "" });
    };

    const handleImageRemove = (id: string) => {
        const updatedImages = images.filter((img) => img.id !== id);
        onChange(updatedImages);
    };

    const handleAddImageClick = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/png,image/jpg,image/jpeg";
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) handleFileSelect(file);
        };
        input.click();
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {images.map((image) => (
                    <div key={image.id} className="relative border rounded-md p-2">
                        <img
                            src={image.url}
                            alt="Product"
                            className="w-full h-32 object-contain"
                        />
                        <div className="mt-2 flex justify-between">
                            {image.isUploaded ? (
                                <span className="text-sm text-green-600 flex items-center w-full justify-center">
                                    <svg
                                        className="w-4 h-4 mr-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M5 13l4 4L19 7"
                                        ></path>
                                    </svg>
                                    Saved
                                </span>
                            ) : (
                                <span className="text-sm text-gray-500 flex items-center w-full justify-center">
                                    Not Saved
                                </span>
                            )}
                        </div>
                        <button
                            onClick={() => handleImageRemove(image.id)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                            type="button"
                        >
                            ×
                        </button>
                    </div>
                ))}

                {images.length < maxImages && (
                    <div
                        className="border-2 border-dashed border-gray-300 rounded-md h-32 flex items-center justify-center cursor-pointer"
                        onClick={handleAddImageClick}
                    >
                        <span className="text-gray-500">+ Add Image</span>
                    </div>
                )}
            </div>

            <div className="text-sm text-gray-500">
                Upload up to {maxImages} product images. At least {minImages} images are required.
                (Supported formats: PNG, JPG, JPEG)
            </div>

            <CropDialog
                isOpen={cropDialogData.isOpen}
                onClose={() => setCropDialogData({ isOpen: false, imageUrl: "" })}
                imageUrl={cropDialogData.imageUrl}
                onCropComplete={handleCropComplete}
                aspectRatio={aspectRatio}
            />
        </div>
    );
};
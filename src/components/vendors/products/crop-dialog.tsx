import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Point, Area } from 'react-easy-crop';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface CropDialogProps {
    isOpen: boolean;
    onClose: () => void;
    imageUrl: string;
    onCropComplete: (croppedFile: File) => void;
    aspectRatio?: number;
}

export const CropDialog: React.FC<CropDialogProps> = ({
    isOpen,
    onClose,
    imageUrl,
    onCropComplete,
    aspectRatio = 1,
}) => {
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [rotation, setRotation] = useState(0);

    const onCropChange = useCallback((location: Point) => {
        setCrop(location);
    }, []);

    const onZoomChange = useCallback((value: number[]) => {
        setZoom(value[0]);
    }, []);
    
    const onRotationChange = useCallback((value: number[]) => {
        setRotation(value[0]);
    }, []);

    const onCropAreaChange = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const createCroppedImage = useCallback(async () => {
        if (!croppedAreaPixels) return null;

        try {
            const originalImage = new Image();
            
            return new Promise<File>((resolve) => {
                originalImage.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    if (!ctx) throw new Error('Could not get canvas context');

                    canvas.width = croppedAreaPixels.width;
                    canvas.height = croppedAreaPixels.height;

                    if (rotation !== 0) {
                        ctx.translate(canvas.width / 2, canvas.height / 2);
                        ctx.rotate((rotation * Math.PI) / 180);
                        ctx.translate(-canvas.width / 2, -canvas.height / 2);
                    }

                    ctx.drawImage(
                        originalImage,
                        croppedAreaPixels.x,
                        croppedAreaPixels.y,
                        croppedAreaPixels.width,
                        croppedAreaPixels.height,
                        0,
                        0,
                        croppedAreaPixels.width,
                        croppedAreaPixels.height
                    );

                    canvas.toBlob((blob) => {
                        if (!blob) throw new Error('Canvas could not produce blob');
                        const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
                        resolve(file);
                    }, 'image/jpeg', 0.95); 
                };

                originalImage.src = imageUrl;
            });
        } catch (e) {
            console.error('Error creating cropped image:', e);
            return null;
        }
    }, [croppedAreaPixels, imageUrl, rotation]);

    const handleSaveCrop = useCallback(async () => {
        try {
            const croppedFile = await createCroppedImage();
            if (croppedFile) {
                onCropComplete(croppedFile);
                onClose();
            }
        } catch (e) {
            console.error('Error saving cropped image:', e);
        }
    }, [createCroppedImage, onCropComplete, onClose]);

    if (!imageUrl) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Crop Image</DialogTitle>
                </DialogHeader>

                <div className="relative h-64 sm:h-96 overflow-hidden rounded-md mt-2">
                    <Cropper
                        image={imageUrl}
                        crop={crop}
                        zoom={zoom}
                        aspect={aspectRatio}
                        rotation={rotation}
                        onCropChange={onCropChange}
                        onRotationChange={setRotation}
                        onCropComplete={onCropAreaChange}
                        onZoomChange={setZoom}
                        showGrid={true}
                    />
                </div>

                <div className="mt-4 space-y-4 px-1">
                    <div>
                        <label className="text-sm font-medium">Zoom</label>
                        <Slider
                            value={[zoom]}
                            onValueChange={onZoomChange}
                            min={1}
                            max={3}
                            step={0.1}
                            className="mt-2"
                        />
                    </div>
                    
                    <div>
                        <label className="text-sm font-medium">Rotation</label>
                        <Slider
                            value={[rotation]}
                            onValueChange={onRotationChange}
                            min={0}
                            max={360}
                            step={1}
                            className="mt-2"
                        />
                    </div>
                </div>

                <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSaveCrop}>Save Crop</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
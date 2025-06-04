import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useRef, useState } from "react";
import ReactCrop, { Crop } from "react-image-crop";
import { DialogHeader } from "../ui/dialog";
import { Button } from "../ui/button";

interface CropDialogProps {
    isOpen: boolean;
    onClose: () => void;
    imageUrl: string;
    onCropComplete: (croppedImage: File) => void;
}

export const CropDialog = ({ isOpen, onClose, imageUrl, onCropComplete }: CropDialogProps) => {
    const [crop, setCrop] = useState<Crop>({
        unit: '%',
        width: 50,
        height: 50,
        x: 25,
        y: 25
    });
    const imageRef = useRef<HTMLImageElement>(null);

    const getCroppedImg = async () => {
        if (!imageRef.current) return;

        const canvas = document.createElement('canvas');
        const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
        const scaleY = imageRef.current.naturalHeight / imageRef.current.height;

        canvas.width = crop.width! * scaleX;
        canvas.height = crop.height! * scaleY;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(
            imageRef.current,
            crop.x! * scaleX,
            crop.y! * scaleY,
            crop.width! * scaleX,
            crop.height! * scaleY,
            0,
            0,
            crop.width! * scaleX,
            crop.height! * scaleY
        );

        canvas.toBlob((blob) => {
            if (blob) {
                const croppedFile = new File([blob], 'cropped-image.jpg', {
                    type: 'image/jpeg',
                    lastModified: Date.now()
                });
                onCropComplete(croppedFile);
            }
        }, 'image/jpeg', 1);
    };

    return (
        <Dialog open={isOpen} onOpenChange={() => onClose()}>
            <DialogContent className="max-w-[800px] w-[90vw]">
                <DialogHeader>
                    <DialogTitle>Crop Image</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    <div className="relative w-full max-h-[60vh] overflow-hidden">
                        <div className="w-full h-full">
                            <ReactCrop
                                crop={crop}
                                onChange={(c) => setCrop(c)}
                                minWidth={10}
                                minHeight={10}
                                keepSelection={true}
                                className="max-w-full"
                            >
                                <img
                                    ref={imageRef}
                                    src={imageUrl}
                                    alt="Crop preview"
                                    className="max-w-full max-h-[50vh] object-contain mx-auto"
                                    style={{
                                        display: 'block',
                                        maxHeight: 'calc(60vh - 120px)'
                                    }}
                                />
                            </ReactCrop>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" onClick={onClose}>Cancel</Button>
                        <Button onClick={getCroppedImg}>Apply Crop</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
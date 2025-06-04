import React, { useState, useCallback } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button } from '@/components/ui/button';

interface ImageCropperProps {
  image: string;
  onCropComplete: (croppedImageUrl: string) => void;
  aspectRatio?: number;
}

export const ImageCropper: React.FC<ImageCropperProps> = ({
  image,
  onCropComplete,
  aspectRatio = 1,
}) => {
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 80,
    height: 80,
    x: 10,
    y: 10,
  });
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    setImageRef(e.currentTarget);
  }, []);

  const handleCropComplete = useCallback(() => {
    if (imageRef && crop.width && crop.height) {
      const canvas = document.createElement('canvas');
      const scaleX = imageRef.naturalWidth / imageRef.width;
      const scaleY = imageRef.naturalHeight / imageRef.height;
      canvas.width = crop.width * scaleX;
      canvas.height = crop.height * scaleY;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.drawImage(
          imageRef,
          crop.x * scaleX,
          crop.y * scaleY,
          crop.width * scaleX,
          crop.height * scaleY,
          0,
          0,
          crop.width * scaleX,
          crop.height * scaleY
        );

        const base64Image = canvas.toDataURL('image/jpeg');
        onCropComplete(base64Image);
      }
    }
  }, [crop, imageRef, onCropComplete]);

  return (
    <div className="flex flex-col space-y-4">
      <div className="max-h-96 overflow-auto">
        <ReactCrop
          crop={crop}
          onChange={(newCrop) => setCrop(newCrop)}
          aspect={aspectRatio}
        >
          <img src={image} alt="Source" onLoad={onImageLoad} />
        </ReactCrop>
      </div>
      <div className="flex justify-end">
        <Button onClick={handleCropComplete}>Apply Crop</Button>
      </div>
    </div>
  );
};

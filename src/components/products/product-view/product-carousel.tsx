import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Lens } from "@/registry/magicui/lens/Lens";

export const ProductImageCarousel: React.FC<{
  images: string[];
  discountPercentage?: number;
}> = ({ images, discountPercentage }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-2 overflow-y-auto max-h-[500px] w-20">
        {images.map((image, index) => (
          <Button
            key={index}
            variant="outline"
            className={`w-20 h-20 p-0 rounded-md shadow-sm border-gray-200 ${currentImageIndex === index ? "ring-2 ring-green-500" : ""
              }`}
            onClick={() => setCurrentImageIndex(index)}
          >
            <img
              src={image}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-cover rounded-md"
            />
          </Button>
        ))}
      </div>


      <div className="flex items-center gap-2 flex-1">

        <Button
          variant="outline"
          size="icon"
          className="text-gray-600 hover:bg-gray-100 border-gray-300 rounded-full shadow-md p-2"
          onClick={handlePrevImage}
          disabled={images.length <= 1}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>


        <div className="h-[500px] w-full relative overflow-hidden rounded-lg shadow-lg">
          <Lens
            zoomFactor={2}
            lensSize={150}
            isStatic={false}
            ariaLabel="Zoom Area"
          >
            <img
              src={images[currentImageIndex]}
              alt="image placeholder"
              width={500}
              height={500}
            />
          </Lens>

          {discountPercentage && discountPercentage > 0 && (
            <div className="absolute top-4 left-4 bg-green-600 text-white px-2 py-1 rounded-full text-sm">
              {discountPercentage}% OFF
            </div>
          )}
        </div>


        <Button
          variant="outline"
          size="icon"
          className="text-gray-600 hover:bg-gray-100 border-gray-300 rounded-full shadow-md p-2"
          onClick={handleNextImage}
          disabled={images.length <= 1}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
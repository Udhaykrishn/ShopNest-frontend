import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { CAROUSEL_IMAGES } from "@/constants/shop";

export const ProductCarousel = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + CAROUSEL_IMAGES.length) % CAROUSEL_IMAGES.length);
    };

    return (
        <div className="relative h-[500px] mb-12 overflow-hidden">
            <div
                className="absolute inset-0 flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
                {CAROUSEL_IMAGES.map((slide: { title: string, subtitle: string, url: string }, index: number) => (
                    <div key={index} className="relative w-full flex-shrink-0">
                        <img
                            src={slide.url}
                            alt={slide.title}
                            className="w-full h-[500px] object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/30 flex flex-col items-center justify-center text-white">
                            <h2 className="text-5xl font-bold mb-4">{slide.title}</h2>
                            <p className="text-2xl font-light">{slide.subtitle}</p>
                            <Button className="mt-8 bg-primary hover:bg-transparent hover:border-primary hover:border-2 text-white">
                                Shop Now
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
            <button
                onClick={prevSlide}
                className="absolute text-white left-4 top-1/2 -translate-y-1/2 bg-primary p-3 rounded-full hover:bg-transparent hover:text-primary transition-colors"
            >
                <ChevronLeft className="h-6 w-6" />
            </button>
            <button
                onClick={nextSlide}
                className="absolute bg-primary text-white right-4 top-1/2 -translate-y-1/2 p-3 rounded-full hover:bg-transparent hover:text-primary transition-colors"
            >
                <ChevronRight className="h-6 w-6" />
            </button>
        </div>
    );
};
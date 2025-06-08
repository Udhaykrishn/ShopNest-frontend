declare module 'react-image-magnifiers' {
  interface MagnifierProps {
    imageSrc: string;
    imageAlt: string;
    largeImageSrc: string;
    className?: string;
    magnifierSize?: number;
    zoomFactor?: number;
  }

  export const Magnifier: React.FC<MagnifierProps>;
} 
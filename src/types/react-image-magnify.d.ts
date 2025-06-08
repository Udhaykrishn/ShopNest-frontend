declare module 'react-image-magnify' {
  interface ImageProps {
    alt: string;
    src: string;
    isFluidWidth?: boolean;
    sizes?: string;
    width?: number;
    height?: number;
  }

  interface ReactImageMagnifyProps {
    smallImage: ImageProps;
    largeImage: ImageProps;
    enlargedImageContainerDimensions?: {
      width: string;
      height: string;
    };
    enlargedImageContainerStyle?: React.CSSProperties;
  }

  const ReactImageMagnify: React.FC<ReactImageMagnifyProps>;
  export default ReactImageMagnify;
} 
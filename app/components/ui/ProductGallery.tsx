import {Image} from '@shopify/hydrogen';
import {useState, useRef, useEffect} from 'react';

function ProductGallery({
  images,
  selectedVariantImage,
}: {
  images: Array<{url: string; altText?: string}>;
  selectedVariantImage?: {url: string; altText?: string};
}) {
  const [selectedImage, setSelectedImage] = useState(
    selectedVariantImage || images[0],
  );
  const thumbnailsRef = useRef<Array<HTMLImageElement | null>>([]);

  // Preload images
  useEffect(() => {
    images.forEach((image) => {
      const img = new window.Image();
      img.src = image.url;
    });
  }, [images]);

  useEffect(() => {
    if (selectedVariantImage) {
      setSelectedImage(selectedVariantImage);
    }
  }, [selectedVariantImage]);

  useEffect(() => {
    const selectedIndex = images.findIndex(
      (image) => image.url === selectedImage.url,
    );
    const selectedThumbnail = thumbnailsRef.current[selectedIndex];

    if (selectedThumbnail) {
      const thumbnailRect = selectedThumbnail.getBoundingClientRect();
      const parentRect =
        selectedThumbnail.parentElement?.getBoundingClientRect();

      if (
        parentRect &&
        (thumbnailRect.left < parentRect.left ||
          thumbnailRect.right > parentRect.right)
      ) {
        selectedThumbnail.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
        });
      }
    }
  }, [selectedImage, images]);

  return (
    <div>
      <div className="mb-4">
        <div className="w-full h-[75vh] mx-auto">
          <Image
            data={selectedImage}
            aspectRatio="2/3"
            className="w-full h-full object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </div>

      <div className="flex space-x-2 overflow-x-auto pb-2 max-w-full max-h-24">
        <div className="flex space-x-2 overflow-x-auto">
          {images.map((image, index) => (
            <Image
              key={index}
              data={image}
              aspectRatio="2/3" // Use an appropriate aspect ratio for thumbnails
              className={`thumbnail cursor-pointer w-20 h-20 object-cover border ${
                selectedImage.url === image.url
                  ? 'border-secondary-500'
                  : 'border-transparent'
              }`}
              sizes="80px"
              ref={(el) => (thumbnailsRef.current[index] = el)}
              onClick={() => setSelectedImage(image)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductGallery;

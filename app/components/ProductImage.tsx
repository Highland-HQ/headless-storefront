import type {ProductVariantFragment} from 'storefrontapi.generated';
import {Image} from '@shopify/hydrogen';

export function ProductImage({
  image,
}: {
  image: ProductVariantFragment['image'];
}) {
  if (!image) {
    return <div />;
  }
  return (
    <div className="w-full">
      <Image
        alt={image.altText || 'Product Image'}
        aspectRatio="2/3"
        data={image}
        key={image.id}
        className="w-full rounded-md shadow-lg"
      />
    </div>
  );
}

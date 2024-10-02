import {Image} from '@shopify/hydrogen';
import {Button} from '../ui/Button';
import {Link} from '@remix-run/react';
import {ArrowRight} from 'lucide-react';

export const FeaturedCollection = ({collection}: {collection: any}) => {
  if (!collection) return null;
  const image = collection?.image;

  return (
    <div className="relative w-full h-[65vh] md:h-full">
      {image && (
        <div className="w-full h-full overflow-hidden">
          <Image
            data={image}
            sizes="(min-width: 100vw)"
            className="w-full h-[70vh] object-cover"
          />
        </div>
      )}
      <div className="shadow-2xl absolute inset-0 bg-black/50 text-white px-4">
        <div className="max-w-layout h-full mx-auto flex flex-col items-start justify-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-8">
            SHOP OUR {collection.title.toUpperCase()}
          </h1>
          <Button variant="primary">
            <Link
              className="flex items-center font-bold"
              to={`/collections/${collection.handle}`}
            >
              <span>SHOP NOW</span>
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

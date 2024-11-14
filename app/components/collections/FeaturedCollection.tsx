import {Image} from '@shopify/hydrogen';
import {Button} from '../ui/Button';
import {Link} from '@remix-run/react';
import {ArrowRight} from 'lucide-react';

export const FeaturedCollection = ({collection}: {collection: any}) => {
  if (!collection) return null;
  const image = collection?.image;

  return (
    <div className="relative h-[65vh] md:h-full m-4 rounded-lg overflow-hidden">
      {image && (
        <div className="w-full h-full">
          <Image
            data={image}
            sizes="(min-width: 100vw)"
            className="w-full h-[70vh] object-cover rounded-lg"
          />
        </div>
      )}
      <div className="shadow-2xl absolute inset-0 bg-black/50 text-white px-4 rounded-lg">
        <div className="max-w-layout h-full mx-auto flex flex-col items-start justify-center">
          <p className="text-xl font-bold tracking-widest text-primary">
            SHOP OUR
          </p>
          <h1 className="text-5xl md:text-8xl font-bold mb-8">
            {collection.title.toUpperCase()}
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

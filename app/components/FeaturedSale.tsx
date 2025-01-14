import {MoveRight} from 'lucide-react';
import {Button} from './ui/Button';
import {Link} from '@remix-run/react';

interface FeaturedSaleProps {
  mainText: string;
  product?: {
    title: string;
    images: {nodes: Array<{url: string}>};
  };
  // this isn't bad code I promise
  collection: any;
}

// Fuck this component needs help...
export const FeaturedSale = ({product, collection}: FeaturedSaleProps) => {
  const randomImage =
    product?.images?.nodes[
      Math.floor(Math.random() * product.images.nodes.length)
    ]?.url;

  // const collectionImage =
  //   collection.images?.nodes[
  //     Math.floor(Math.random() * collection.images.nodes.length)
  //   ]?.url;

  return (
    <div className="relative w-screen h-[70vh] rounded-lg p-4">
      <img
        src="https://cdn.shopify.com/s/files/1/0701/9036/6953/files/DSC_0094.jpg?v=1731365565&width=1400&height=2100&crop=center"
        alt={`Black Friday Inspired Photo`}
        className="w-full h-full object-cover rounded-lg"
      />
      <div className="m-4 p-4 rounded-lg absolute inset-0 flex flex-col items-start justify-center bg-black/50 text-zinc-50">
        <div className="max-w-layout w-full mx-auto">
          {/* <p className="text-xl font-bold tracking-widest text-primary">
            SITEWIDE SALE
          </p> */}
          <h1 className="text-5xl md:text-8xl font-bold mb-2">WEEKLY SALE</h1>
          <h2 className="text-2xl md:text-4xl pt-2 md:pt-0">
            30% OFF ALL GRAPHIC TEES!
          </h2>
          <Link to={`collections/all/Graphic Tees`}>
            <Button type="button" variant="primary" className="mt-6">
              <span>SHOP NOW</span>
              <MoveRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

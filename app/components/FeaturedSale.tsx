import {MoveRight} from 'lucide-react';
import {Button} from './ui/Button';
import {Link} from '@remix-run/react';

interface FeaturedSaleProps {
  mainText: string;
  product: {
    title: string;
    images: {nodes: Array<{url: string}>};
  };
}

export const FeaturedSale = ({product}: FeaturedSaleProps) => {
  const randomImage =
    product.images?.nodes[
      Math.floor(Math.random() * product.images.nodes.length)
    ]?.url;

  return (
    <div className="relative w-screen h-[70vh] mt-4 rounded-lg p-4">
      {randomImage && (
        <img
          src={randomImage}
          alt={`${product.title} Image`}
          className="w-full h-full object-cover rounded-lg"
        />
      )}
      <div className="m-4 p-4 rounded-lg absolute inset-0 flex flex-col items-start justify-center bg-black/50 text-zinc-50">
        <div className="max-w-layout w-full mx-auto">
          <p className="text-xl font-bold tracking-widest text-primary">
            BOGO FREE
          </p>
          <h1 className="text-5xl md:text-9xl font-bold mb-2">CLAW CLIPS</h1>
          <h2 className="text-2xl md:text-4xl pt-2 md:pt-0">
            Buy one get one free on all claw clips!
          </h2>
          <Link to={`products/western-claw-clips`}>
            <Button type="button" variant="primary" className="mt-6">
              <span>FIND YOUR FAVORITE</span>
              <MoveRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

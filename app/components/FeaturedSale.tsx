import {MoveRight} from 'lucide-react';
import {Button} from './ui/Button';
import {Link} from '@remix-run/react';

export const FeaturedSale = ({
  image_url,
  image_alt,
  heading,
  subheading,
  buttonText,
  buttonLink,
}: {
  image_url: string;
  image_alt: string;
  heading: string;
  subheading: string;
  buttonText: string;
  buttonLink: string;
}) => {
  return (
    <div className="relative w-screen h-[70vh] rounded-lg p-4">
      <img
        src={image_url}
        alt={image_alt}
        className="w-full h-full object-cover rounded-lg"
      />
      <div className="m-4 p-4 rounded-lg absolute inset-0 flex flex-col items-start justify-center bg-black/50 text-zinc-50">
        <div className="max-w-layout w-full mx-auto">
          <h1 className="text-3xl md:text-6xl font-bold mb-2">{heading}</h1>
          <h2 className="text-lg md:text-2xl pt-2 md:pt-0 font-semibold text-primary-50">
            {subheading}
          </h2>
          <Link to={buttonLink}>
            <Button type="button" variant="primary" className="mt-6">
              <span>{buttonText}</span>
              <MoveRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

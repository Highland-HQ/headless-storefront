import {ArrowRight} from 'lucide-react';
import {Button} from '../ui/Button';
import {Suspense} from 'react';
import {Await, Link} from '@remix-run/react';
import {Image, Money} from '@shopify/hydrogen';

export const RecommendedProducts = ({
  products,
}: {
  products: Promise<any | null>;
}) => {
  return (
    <div className="my-12 mx-auto px-4 md:px-6">
      <div className="flex flex-col my-4 md:flex-row items-start md:items-center justify-between">
        <h2 className="text-xl md:text-3xl font-semibold">
          RECOMMENDED PRODUCTS
        </h2>

        <Button
          size="medium"
          variant="ghost"
          className="px-0! md:px-4 tracking-widest"
        >
          <Link
            to="collections/august-collection"
            className="flex items-center"
          >
            See More <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {(response) => (
            <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {response
                ? response.products.nodes.map((product: any) => (
                    <Link
                      key={product.id}
                      to={`/products/${product.handle}`}
                      className="hover:scale-[0.99] transition-all"
                    >
                      <Image
                        className="rounded shadow"
                        data={product.images.nodes[0]}
                        aspectRatio="2/3"
                        sizes="(min-width: 45em) 20vw, 50vw"
                      />
                      <h4 className="text-lg font-semibold tracking-wide">
                        {product.title}
                      </h4>
                      <small className="text-base tracking-widest">
                        <Money data={product.priceRange.minVariantPrice} />
                      </small>
                    </Link>
                  ))
                : null}
            </div>
          )}
        </Await>
      </Suspense>
      <br />
    </div>
  );
};

import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link, type MetaFunction} from '@remix-run/react';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import type {
  FeaturedCollectionFragment,
  RecommendedProductsQuery,
} from 'storefrontapi.generated';
import {FEATURED_COLLECTION_QUERY} from '~/graphql/collections/FeaturedCollection';
import {RECOMMENDED_PRODUCTS_QUERY} from '~/graphql/products/RecommendedProducts';
import {ArrowRight} from 'lucide-react';
import {FEATURED_COLLECTION_HANDLE} from '~/conf/SiteSettings';

export const meta: MetaFunction = () => {
  return [{title: 'Highland HQ | Home'}];
};

export async function loader(args: LoaderFunctionArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);

  return defer({...deferredData, ...criticalData});
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context}: LoaderFunctionArgs) {
  const [{collectionByHandle}] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY, {
      variables: {handle: FEATURED_COLLECTION_HANDLE},
    }),
  ]);

  return {
    featuredCollection: collectionByHandle,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error) => {
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
  };
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="home">
      <FeaturedCollection collection={data.featuredCollection} />
      <RecommendedProducts products={data.recommendedProducts} />
    </div>
  );
}

function FeaturedCollection({
  collection,
}: {
  collection: FeaturedCollectionFragment;
}) {
  if (!collection) return null;
  const image = collection?.image;

  return (
    <div className="relative w-full h-[65vh] md:h-full">
      {image && (
        <div className="w-full h-full overflow-hidden">
          <Image
            data={image}
            sizes="(min-width: 100vw)"
            className="w-full h-[85vh] object-cover"
          />
        </div>
      )}
      <div className="absolute inset-0 bg-black/50 text-white px-4 md:px-0">
        <div className="max-w-layout h-full mx-auto flex flex-col items-start justify-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-8">
            SHOP OUR {collection.title.toUpperCase()}
          </h1>
          <button className="border border-gray-50 px-4 py-2 rounded-md text-gray-50">
            <Link
              className="flex items-center font-bold"
              to={`/collections/${collection.handle}`}
            >
              <span>SHOP NOW</span>
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
}

function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery | null>;
}) {
  return (
    <div className="recommended-products">
      <h2>Recommended Products</h2>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {(response) => (
            <div className="recommended-products-grid">
              {response
                ? response.products.nodes.map((product) => (
                    <Link
                      key={product.id}
                      className="recommended-product"
                      to={`/products/${product.handle}`}
                    >
                      <Image
                        data={product.images.nodes[0]}
                        aspectRatio="1/1"
                        sizes="(min-width: 45em) 20vw, 50vw"
                      />
                      <h4>{product.title}</h4>
                      <small>
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
}

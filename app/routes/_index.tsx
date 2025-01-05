import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, type MetaFunction} from '@remix-run/react';
import {FEATURED_COLLECTION_QUERY} from '~/graphql/collections/FeaturedCollection';
import {RECOMMENDED_PRODUCTS_QUERY} from '~/graphql/products/RecommendedProducts';
import {FEATURED_COLLECTION_HANDLE} from '~/conf/SiteSettings';
import {RecommendedProducts} from '~/components/products/RecommendedProducts';
import {FeaturedCollection} from '~/components/collections/FeaturedCollection';
import {FeaturedSale} from '~/components/FeaturedSale';
import {PRODUCT_QUERY} from '~/graphql/products/Product';
import {InfoSection} from '~/components/InfoSection';

export const meta: MetaFunction = () => {
  return [
    {title: 'Highland HQ | Home'},
    {
      name: 'description',
      content:
        'Highland HQ: Your premium Western wear destination. Find quality boots, hats, jeans, shirts, dresses, and jewelry. Elevate your style with authentic Western fashion.',
    },
  ];
};

export async function loader(args: LoaderFunctionArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);

  return defer({...deferredData, ...criticalData});
}

async function loadCriticalData({context}: LoaderFunctionArgs) {
  const [{collectionByHandle}, {product}, {featuredSaleCollection}] =
    await Promise.all([
      context.storefront.query(FEATURED_COLLECTION_QUERY, {
        variables: {handle: FEATURED_COLLECTION_HANDLE},
      }),
      context.storefront.query(PRODUCT_QUERY, {
        variables: {handle: 'western-claw-clips'},
      }),
      context.storefront.query(FEATURED_COLLECTION_QUERY, {
        variables: {handle: 'october-collection'},
      }),
    ]);

  return {
    featuredCollection: collectionByHandle,
    featuredProduct: product,
    featuredSaleCollection,
  };
}

function loadDeferredData({context}: LoaderFunctionArgs) {
  const query = 'tag:Recommended';

  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY, {
      variables: {
        query,
      },
    })
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
    <div>
      <FeaturedCollection collection={data.featuredCollection} />
      <InfoSection />
      {/* <FeaturedSale
        mainText="BOGO Free On All Claw Clips!"
        // product={data.featuredProduct}
        collection={data.featuredSaleCollection}
      /> */}
      <RecommendedProducts products={data.recommendedProducts} />
    </div>
  );
}

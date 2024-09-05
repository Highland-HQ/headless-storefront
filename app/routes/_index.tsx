import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, type MetaFunction} from '@remix-run/react';
import {FEATURED_COLLECTION_QUERY} from '~/graphql/collections/FeaturedCollection';
import {RECOMMENDED_PRODUCTS_QUERY} from '~/graphql/products/RecommendedProducts';
import {
  FEATURED_COLLECTION_HANDLE,
  FIRST_FEATURED_PRODUCT_HANDLE,
  SITE_ANNOUNCEMENT_TEXT,
} from '~/conf/SiteSettings';
import {RecommendedProducts} from '~/components/products/RecommendedProducts';
import {FeaturedCollection} from '~/components/collections/FeaturedCollection';

export const meta: MetaFunction = () => {
  return [{title: 'Highland HQ | Home'}];
};

export async function loader(args: LoaderFunctionArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);

  return defer({...deferredData, ...criticalData});
}

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
      <RecommendedProducts products={data.recommendedProducts} />
    </div>
  );
}

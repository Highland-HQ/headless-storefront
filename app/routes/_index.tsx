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
      <FeaturedSale
        image_url="https://cdn.shopify.com/s/files/1/0701/9036/6953/collections/banner.jpg?v=1725410478"
        image_alt="Two people looking into the distance in a vast field, with two horses in the frame."
        heading="NEW CLEARANCE ITEMS"
        subheading="45% OFF SELECT ITEMS"
        buttonText="SHOP NOW"
        buttonLink="/collections/clearance"
      />
      <InfoSection />
      {/* <FeaturedSale
        image_url="https://cdn.shopify.com/s/files/1/0701/9036/6953/files/webflatlay2.jpg?v=1722572380&width=1400&height=2100&crop=center"
        image_alt="Closeup on woman with blonde hair, wearing graphic tee with image of desert."
        heading="WEEKLY SALE"
        subheading="BOGO ON ALL ACCESSORIES, DISCOUNT APPLIED AT CHECKOUT!"
        buttonText="SHOP ACCESSORIES"
        buttonLink="collections/jewelry-accessories"
      /> */}
      <RecommendedProducts products={data.recommendedProducts} />
    </div>
  );
}

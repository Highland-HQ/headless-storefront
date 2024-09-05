import {defer, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, Link, type MetaFunction} from '@remix-run/react';
import {
  Pagination,
  getPaginationVariables,
  Image,
  Money,
  Analytics,
} from '@shopify/hydrogen';
import type {ProductItemFragment} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';
import {COLLECTION_QUERY} from '~/graphql/collections/CollectionsByHandle';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `Highland HQ | ${data?.collections[0].title ?? ''}`}];
};

export async function loader(args: LoaderFunctionArgs) {
  const deferredData = await loadDeferredData(args);
  const criticalData = await loadCriticalData(args);

  return defer({...deferredData, ...criticalData});
}

async function loadCriticalData({
  context,
  params,
  request,
}: LoaderFunctionArgs) {
  const {handles, tag} = params;
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 12,
  });

  const handleList = handles ? handles.split(',') : [];

  if (!handleList.length) {
    throw redirect('/collections');
  }

  const filters = tag ? [{tag}] : [];

  const collectionQueries = handleList.map((handle) =>
    storefront.query(COLLECTION_QUERY, {
      variables: {handle, filters, ...paginationVariables},
    }),
  );

  const collectionResults = await Promise.all(collectionQueries);

  const collections = collectionResults
    .map((result) => result?.collection)
    .filter(Boolean);

  if (!collections.length) {
    throw new Response(`Collection ${handles} not found`, {
      status: 404,
    });
  }

  const allProducts = collections.reduce((products, collection) => {
    return products.concat(collection.products.nodes);
  }, []);

  return {
    collections,
    allProducts,
    handles: handleList,
  };
}

function loadDeferredData({context}: LoaderFunctionArgs) {
  return {};
}

function constructSimpleTitle(collections: any[]): string {
  if (collections.length === 1) {
    return collections[0].title;
  }

  // Simple joining of titles for multiple collections
  return collections.map((collection) => collection.title).join(', ');
}

export default function Collection() {
  const {collections, allProducts} = useLoaderData<typeof loader>();

  const firstCollection = collections[0];
  const simpleTitle = constructSimpleTitle(collections);

  return (
    <div>
      {firstCollection?.image ? (
        <>
          <Image
            data={firstCollection?.image}
            sizes="(min-width: 100vw)"
            className="w-full h-[35vh] object-cover"
          />
          <div className="shadow-2xl absolute inset-0 bg-black/50 w-full h-[35vh] flex items-end justify-start">
            <div className="max-w-layout mx-auto w-full text-gray-50">
              <h1 className="text-3xl md:text-4xl font-semibold tracking-wide mb-6 mx-4">
                {simpleTitle}
              </h1>
            </div>
          </div>
        </>
      ) : (
        <div className="inset-0 w-full flex items-end justify-start px-4 pt-24 md:pt-32">
          <div className="max-w-layout mx-auto w-full text-secondary">
            <h1 className="text-4xl font-semibold tracking-wide mx-4">
              {simpleTitle}
            </h1>
          </div>
        </div>
      )}

      <div className="mt-12 max-w-layout mx-auto p-4">
        <ProductsGrid products={allProducts} />
        <Analytics.CollectionView
          data={{
            collection: {
              id: collections[0].id,
              handle: collections[0].handle,
            },
          }}
        />
      </div>
    </div>
  );
}

function ProductsGrid({products}: {products: ProductItemFragment[]}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
      {products.map((product, index) => {
        return (
          <ProductItem
            key={product.id}
            product={product}
            loading={index < 12 ? 'eager' : undefined}
          />
        );
      })}
    </div>
  );
}

function ProductItem({
  product,
  loading,
}: {
  product: ProductItemFragment;
  loading?: 'eager' | 'lazy';
}) {
  const variant = product.variants.nodes[0];
  const variantUrl = useVariantUrl(product.handle, variant.selectedOptions);
  return (
    <Link key={product.id} prefetch="intent" to={variantUrl}>
      {product.featuredImage && (
        <Image
          className="rounded shadow-sm border border-secondary/10"
          alt={product.featuredImage.altText || product.title}
          aspectRatio="2/3"
          data={product.featuredImage}
          loading={loading}
          sizes="(min-width: 45em) 400px, 100vw"
        />
      )}
      <h4 className="text-xl tracking-wide font-semibold mt-2">
        {product.title}
      </h4>
      <small className="text-base tracking-widest">
        <Money data={product.priceRange.minVariantPrice} />
      </small>
    </Link>
  );
}

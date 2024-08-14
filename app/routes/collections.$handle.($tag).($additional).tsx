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
  return [{title: `Highland HQ | ${data?.collection.title ?? ''}`}];
};

export async function loader(args: LoaderFunctionArgs) {
  const deferredData = loadDeferredData(args);

  const criticalData = await loadCriticalData(args);

  return defer({...deferredData, ...criticalData});
}

async function loadCriticalData({
  context,
  params,
  request,
}: LoaderFunctionArgs) {
  const {handle, tag} = params;
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 12,
  });

  if (!handle) {
    throw redirect('/collections');
  }

  const filters = tag ? [{tag}] : [];

  const [{collection}] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      variables: {handle, filters, ...paginationVariables},
    }),
  ]);

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  return {
    collection,
  };
}

function loadDeferredData({context}: LoaderFunctionArgs) {
  return {};
}

export default function Collection() {
  const {collection} = useLoaderData<typeof loader>();

  return (
    <div>
      {collection?.image ? (
        <>
          <Image
            data={collection?.image}
            sizes="(min-width: 100vw)"
            className="w-full h-[35vh] object-cover"
          />
          <div className="shadow-2xl absolute inset-0 bg-black/50 w-full h-[35vh] flex items-end justify-start">
            <div className="max-w-layout mx-auto w-full text-gray-50">
              <h1 className="text-4xl font-semibold tracking-wide mb-6">
                {collection.title}
              </h1>
            </div>
          </div>
        </>
      ) : (
        <div className="inset-0 w-full flex items-end justify-start px-4 pt-24 pb-6 md:pt-32">
          <div className="max-w-layout mx-auto w-full text-secondary">
            <h1 className="text-4xl font-semibold tracking-wide">
              {collection.title}
            </h1>
          </div>
        </div>
      )}
      <div className="mt-12 max-w-layout mx-auto p-4 md:p-0">
        <p>{collection.description}</p>
        <Pagination connection={collection.products}>
          {({nodes, isLoading, PreviousLink, NextLink}) => (
            <>
              <PreviousLink>
                {isLoading ? 'Loading...' : <span>↑ Load previous</span>}
              </PreviousLink>
              <ProductsGrid products={nodes as any} />
              <br />
              <NextLink>
                {isLoading ? 'Loading...' : <span>Load more ↓</span>}
              </NextLink>
            </>
          )}
        </Pagination>
        <Analytics.CollectionView
          data={{
            collection: {
              id: collection.id,
              handle: collection.handle,
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

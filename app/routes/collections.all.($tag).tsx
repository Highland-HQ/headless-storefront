import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, Link, type MetaFunction} from '@remix-run/react';
import {
  Pagination,
  getPaginationVariables,
  Image,
  Money,
} from '@shopify/hydrogen';
import type {ProductItemFragment} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';
import {Button} from '~/components/ui/Button';
import {ArrowDown, ArrowUp} from 'lucide-react';

export const meta: MetaFunction<typeof loader> = () => {
  return [{title: `Highland HQ | Products`}];
};

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return defer({...deferredData, ...criticalData});
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({
  context,
  request,
  params,
}: LoaderFunctionArgs) {
  const {storefront} = context;

  const {tag} = params;

  const query = tag ? `tag:${tag}` : '';

  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });

  const [{products}] = await Promise.all([
    storefront.query(CATALOG_QUERY, {
      variables: {query, ...paginationVariables},
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);
  return {products};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  return {};
}

export default function Collection() {
  const {products} = useLoaderData<typeof loader>();

  return (
    <div>
      <div className="w-full flex items-end justify-start px-4 pt-24 md:pt-32">
        <div className="max-w-layout mx-auto w-full text-secondary">
          <h1 className="text-4xl font-semibold tracking-wide mb-6">
            Shop All
          </h1>
        </div>
      </div>
      <div className="mt-12 max-w-layout mx-auto p-4 md:p-0">
        <Pagination connection={products}>
          {({nodes, isLoading, PreviousLink, NextLink}) => (
            <>
              <PreviousLink>
                {isLoading ? (
                  'Loading...'
                ) : (
                  <Button variant="secondary" size="medium">
                    Load Previous
                    <span>
                      <ArrowUp className="h-4 w-4 ml-2" />
                    </span>
                  </Button>
                )}
              </PreviousLink>
              <ProductsGrid products={nodes as any} />
              <br />
              <NextLink>
                {isLoading ? (
                  'Loading...'
                ) : (
                  <Button variant="secondary" size="medium">
                    Load More
                    <span>
                      <ArrowDown className="h-4 w-4 ml-2" />
                    </span>
                  </Button>
                )}
              </NextLink>
            </>
          )}
        </Pagination>
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

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
    variants(first: 1) {
      nodes {
        selectedOptions {
          name
          value
        }
      }
    }
  }
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/2024-01/objects/product
const CATALOG_QUERY = `#graphql
  query Catalog(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
    $query: String
  ) @inContext(country: $country, language: $language) {
    products(
      first: $first, 
      last: $last, 
      before: $startCursor, 
      after: $endCursor, 
      query: $query
    ) {
      nodes {
        ...ProductItem
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
  ${PRODUCT_ITEM_FRAGMENT}
` as const;

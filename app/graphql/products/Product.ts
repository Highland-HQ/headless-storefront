export const PRODUCT_QUERY = `#graphql
  fragment ProductDetails on Product {
    id
    title
    handle
    description
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 10) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
  }
  query ProductByHandle(
    $handle: String!,
    $country: CountryCode,
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...ProductDetails
    }
  }
` as const;

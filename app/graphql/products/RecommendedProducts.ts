export const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 1) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
  }
  query RecommendedProducts(
    $country: CountryCode,
    $language: LanguageCode,
    $query: String
  ) @inContext(country: $country, language: $language) {
    products(first: 10, reverse: true, query: $query) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;

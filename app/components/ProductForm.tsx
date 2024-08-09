import {Link} from '@remix-run/react';
import {type VariantOption, VariantSelector} from '@shopify/hydrogen';
import {ShoppingBasket} from 'lucide-react';
import type {
  ProductFragment,
  ProductVariantFragment,
} from 'storefrontapi.generated';
import {AddToCartButton} from '~/components/AddToCartButton';
import {Button} from './ui/Button';

export function ProductForm({
  product,
  selectedVariant,
  variants,
}: {
  product: ProductFragment;
  selectedVariant: ProductFragment['selectedVariant'];
  variants: Array<ProductVariantFragment>;
}) {
  return (
    <div>
      <VariantSelector
        handle={product.handle}
        options={product.options.filter((option) => option.values.length > 1)}
        variants={variants}
      >
        {({option}) => <ProductOptions key={option.name} option={option} />}
      </VariantSelector>
      <AddToCartButton
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        lines={
          selectedVariant
            ? [
                {
                  merchandiseId: selectedVariant.id,
                  quantity: 1,
                  selectedVariant,
                },
              ]
            : []
        }
      >
        {selectedVariant?.availableForSale ? (
          <>
            <span>Add to cart</span>
            <ShoppingBasket className="h-6 w-6 ml-2" />
          </>
        ) : (
          'Sold out'
        )}
      </AddToCartButton>
    </div>
  );
}

function ProductOptions({option}: {option: VariantOption}) {
  return (
    <div className="product-options" key={option.name}>
      <h5 className="text-2xl font-semibold mb-2">{option.name}</h5>
      <div className="product-options-grid">
        {option.values.map(({value, isAvailable, isActive, to}) => {
          return (
            <Button variant={isActive ? 'secondary' : 'ghost'} size="small">
              <Link
                className="product-options-item"
                key={option.name + value}
                prefetch="intent"
                preventScrollReset
                replace
                to={to}
              >
                {value}
              </Link>
            </Button>
          );
        })}
      </div>
      <br />
    </div>
  );
}

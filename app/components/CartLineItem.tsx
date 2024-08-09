import type {CartLineUpdateInput} from '@shopify/hydrogen/storefront-api-types';
import type {CartLayout} from '~/components/CartMain';
import {CartForm, Image, type OptimisticCartLine} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {Link} from '@remix-run/react';
import {ProductPrice} from './ProductPrice';
import {Minus, Plus, Trash} from 'lucide-react';

/**
 * A single line item in the cart. It displays the product image, title, price.
 * It also provides controls to update the quantity or remove the line item.
 */
export function CartLineItem({
  layout,
  line,
}: {
  layout: CartLayout;
  line: OptimisticCartLine;
}) {
  const {id, merchandise} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);

  return (
    <div key={id} className="flex gap-6 w-full">
      {image && (
        <Image
          alt={title}
          aspectRatio="2/3"
          data={image}
          loading="lazy"
          width={100}
          className="rounded shadow border border-secondary/10"
        />
      )}
      <div className="w-full flex items-center justify-between">
        <div className="flex flex-col flex-1 gap-2">
          <Link prefetch="intent" to={lineItemUrl} className="flex-1">
            <strong className="text-xl">{product.title}</strong>
            <div className="flex justify-start gap-2 tracking-widest">
              {selectedOptions.map((option, index) => (
                <div key={option.name} className="text-base">
                  {option.value}
                  {index < selectedOptions.length - 1 && <span> /</span>}
                </div>
              ))}
            </div>
          </Link>
          {layout === 'aside' && (
            <CartLineQuantity line={line} layout={layout} />
          )}
        </div>
        {layout === 'page' && <CartLineQuantity line={line} layout={layout} />}
        <div className={`flex items-center justify-end`}>
          <ProductPrice price={line?.cost?.totalAmount} />
        </div>
      </div>
    </div>
  );
}

/**
 * Provides the controls to update the quantity of a line item in the cart.
 * These controls are disabled when the line item is new, and the server
 * hasn't yet responded that it was successfully added to the cart.
 */
function CartLineQuantity({
  line,
  layout,
}: {
  line: OptimisticCartLine;
  layout: 'aside' | 'page';
}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity, isOptimistic} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div
      className={`flex gap-6 items-center ${
        layout === 'aside' ? 'justify-start' : 'justify-center'
      } flex-1`}
    >
      <div className="flex items-center justify-start">
        <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
          <button
            aria-label="Decrease quantity"
            disabled={quantity <= 1 || !!isOptimistic}
            name="decrease-quantity"
            value={prevQuantity}
            className="px-2 py-2 bg-gray-50/20 rounded hover:cursor-pointer"
          >
            <Minus className="h-6 w-6" />
          </button>
        </CartLineUpdateButton>
        <div className="text-xl font-semibold px-4">{quantity}</div>
        <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
          <button
            aria-label="Increase quantity"
            name="increase-quantity"
            value={nextQuantity}
            disabled={!!isOptimistic}
            className="px-2 py-2 bg-gray-50/20 rounded hover:cursor-pointer"
          >
            <Plus className="h-6 w-6" />
          </button>
        </CartLineUpdateButton>
      </div>
      &nbsp;
      <CartLineRemoveButton lineIds={[lineId]} disabled={!!isOptimistic} />
    </div>
  );
}

/**
 * A button that removes a line item from the cart. It is disabled
 * when the line item is new, and the server hasn't yet responded
 * that it was successfully added to the cart.
 */
function CartLineRemoveButton({
  lineIds,
  disabled,
}: {
  lineIds: string[];
  disabled: boolean;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      <button
        disabled={disabled}
        type="submit"
        className="px-4 py-2 tracking-wide uppercase flex items-center justify-center rounded hover:cursor-pointer bg-secondary hover:bg-secondary/75 text-gray-50 font-semibold transition-all"
      >
        Remove
        <Trash className="h-4 w-4 ml-2" />
      </button>
    </CartForm>
  );
}

function CartLineUpdateButton({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {children}
    </CartForm>
  );
}

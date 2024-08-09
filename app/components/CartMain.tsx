import {type OptimisticCartLine, useOptimisticCart} from '@shopify/hydrogen';
import {Link} from '@remix-run/react';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {CartLineItem} from '~/components/CartLineItem';
import {CartSummary} from './CartSummary';
import {Button} from './ui/Button';
import {MoveRight, ShoppingBag} from 'lucide-react';

export type CartLayout = 'page' | 'aside';

export type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
};

/**
 * The main cart component that displays the cart items and summary.
 * It is used by both the /cart route and the cart aside dialog.
 */
export function CartMain({layout, cart: originalCart}: CartMainProps) {
  // The useOptimisticCart hook applies pending actions to the cart
  // so the user immediately sees feedback when they modify the cart.
  const cart = useOptimisticCart(originalCart);

  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const withDiscount =
    cart &&
    Boolean(cart?.discountCodes?.filter((code) => code.applicable)?.length);
  const cartHasItems = cart?.totalQuantity! > 0;

  return (
    <div className={`flex ${layout === 'aside' ? 'flex-col' : ''} gap-12 p-6`}>
      <div
        className={`flex flex-col flex-1 ${
          !cartHasItems
            ? 'items-center justify-center'
            : 'items-start justify-start'
        }`}
      >
        {!cartHasItems && <ShoppingBag className="h-12 w-12 mb-6" />}
        <h1 className="text-4xl font-semibold">
          {!cartHasItems ? 'Your Cart Is Empty!' : 'Your Cart Items'}
        </h1>
        <hr className="my-4 w-full" />
        <CartEmpty hidden={linesCount} layout={layout} />
        <div aria-labelledby="cart-lines" className="w-full">
          <div className="flex flex-col gap-6 w-full">
            {(cart?.lines?.nodes ?? []).map((line: OptimisticCartLine) => (
              <CartLineItem key={line.id} line={line} layout={layout} />
            ))}
          </div>
        </div>
      </div>
      {cartHasItems && <CartSummary cart={cart} layout={layout} />}
    </div>
  );
}

function CartEmpty({
  hidden = false,
}: {
  hidden: boolean;
  layout?: CartMainProps['layout'];
}) {
  return (
    <div hidden={hidden} className="flex flex-col items-center justify-center">
      <p className="my-4 text-xl tracking-wide">
        Looks like you haven&rsquo;t added anything yet, let&rsquo;s get you
        started!
      </p>
      <Button variant="secondary">
        <Link
          to="/"
          prefetch="viewport"
          className="flex items-center justify-center"
        >
          <span>Continue shopping</span>
          <MoveRight className="h-4 w-4 ml-2" />
        </Link>
      </Button>
    </div>
  );
}

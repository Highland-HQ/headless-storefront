import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {CartLayout} from '~/components/CartMain';
import {CartForm, Money, type OptimisticCart} from '@shopify/hydrogen';
import {Button} from './ui/Button';
import {ShieldCheck} from 'lucide-react';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

export function CartSummary({cart, layout}: CartSummaryProps) {
  return (
    <div
      aria-labelledby="cart-summary"
      className={`h-full ${
        layout === 'aside' ? 'pt-6' : 'max-w-md border rounded-xl p-12'
      } w-full border-t `}
    >
      <h4 className="text-2xl font-semibold">Totals</h4>
      <div className="flex justify-between items-center text-lg tracking-widest my-4">
        Subtotal
        {cart.cost?.subtotalAmount?.amount ? (
          <Money data={cart.cost?.subtotalAmount} />
        ) : (
          '-'
        )}
      </div>
      <p className="text-lg tracking-widest">
        Tax and Shipping Calculated at Checkout.
      </p>
      <CartDiscounts discountCodes={cart.discountCodes} />
      <CartCheckoutActions checkoutUrl={cart.checkoutUrl} layout={layout} />
    </div>
  );
}
function CartCheckoutActions({
  checkoutUrl,
  layout,
}: {
  checkoutUrl?: string;
  layout: 'aside' | 'page';
}) {
  if (!checkoutUrl) return null;

  return (
    <div className="flex flex-col md:flex-row gap-2">
      {/* {layout === 'aside' && (
        <Button variant="outline" size="large" className="w-full">
          <a href="/cart">View Your Cart</a>
        </Button>
      )} */}
      <Button variant="secondary" size="large" className="w-full">
        <a
          href={checkoutUrl}
          target="_self"
          className="flex items-center justyfy-center"
        >
          <span>Continue to Checkout</span>
          <ShieldCheck className="h-6 w-6 ml-2" />
        </a>
      </Button>
    </div>
  );
}

function CartDiscounts({
  discountCodes,
}: {
  discountCodes?: CartApiQueryFragment['discountCodes'];
}) {
  const codes: string[] =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  return (
    <div className="my-6">
      {/* Have existing discount, display it with a remove option */}
      <dl hidden={!codes.length}>
        <div>
          <dt>Discount(s)</dt>
          <UpdateDiscountForm>
            <div className="cart-discount">
              <code>{codes?.join(', ')}</code>
              &nbsp;
              <button>Remove</button>
            </div>
          </UpdateDiscountForm>
        </div>
      </dl>

      {/* Show an input to apply a discount */}
      <UpdateDiscountForm discountCodes={codes}>
        <div className="flex items-center justify-center gap-2">
          <input
            type="text"
            name="discountCode"
            placeholder="Discount Code"
            className="px-4 py-2 rounded bg-gray-50/20 border-none flex-1"
          />
          &nbsp;
          <Button variant="ghost" type="submit">
            Apply
          </Button>
        </div>
      </UpdateDiscountForm>
    </div>
  );
}

function UpdateDiscountForm({
  discountCodes,
  children,
}: {
  discountCodes?: string[];
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}

import {Suspense} from 'react';
import {NavProps} from './navTypes';
import {Await} from '@remix-run/react';
import {CartViewPayload, useAnalytics} from '@shopify/hydrogen';
import {Drawer} from '../ui/Drawer';
import {CartMain} from '../CartMain';
import {Search, ShoppingBag} from 'lucide-react';
import {PredictiveSearchForm, PredictiveSearchResults} from '../Search';
import {Button} from '../ui/Button';

export const SearchToggle = () => {
  return (
    <Drawer
      content={
        <div className="px-4">
          <PredictiveSearchForm>
            {({fetchResults, inputRef}) => (
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  name="q"
                  onChange={fetchResults}
                  onFocus={fetchResults}
                  placeholder="SEARCH FOR..."
                  ref={inputRef}
                  type="search"
                  className="w-full py-3 px-6 text-lg rounded"
                />
                <Button
                  variant="ghost"
                  size="large"
                  onClick={() => {
                    window.location.href = inputRef?.current?.value
                      ? `/search?q=${inputRef.current.value}`
                      : `/search`;
                  }}
                >
                  <span>SEARCH</span>
                  <Search className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </PredictiveSearchForm>

          <div className="mt-6">
            <PredictiveSearchResults />
          </div>
        </div>
      }
      desc="desc"
      header={<h1>Search</h1>}
      position="right"
      toggleIcon={<Search className="h-6 w-6" />}
    />
  );
};

export const CartBadge = ({count}: {count: number | null}) => {
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <Drawer
      desc="Tax and Shipping Calculated at Checkout."
      position="right"
      header={
        <div className="flex gap-2 items-center justify-center">
          <p className="text-2xl font-semibold">
            {count} Item{count && count > 1 ? 's' : ''}
          </p>
        </div>
      }
      content={<CartMain cart={cart} layout="aside" />}
      toggleIcon={
        <div
          className="relative"
          onClick={() => {
            publish('cart_viewed', {
              cart,
              prevCart,
              shop,
              url: window.location.href || '',
            } as CartViewPayload);
          }}
        >
          <ShoppingBag className="h-6 w-6" />
          {count !== null && count > 0 ? (
            <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs rounded-full h-3 w-3 flex items-center justify-center"></span>
          ) : null}
        </div>
      }
    />
  );
};

export const CartToggle = ({cart}: Pick<NavProps, 'cart'>) => {
  return (
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}>
        {(cart) => {
          if (!cart) return <CartBadge count={0} />;
          return <CartBadge count={cart.totalQuantity || 0} />;
        }}
      </Await>
    </Suspense>
  );
};

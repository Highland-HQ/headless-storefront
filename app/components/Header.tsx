import {Suspense} from 'react';
import {Await, NavLink} from '@remix-run/react';
import {type CartViewPayload, useAnalytics} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {LogIn, Menu, Search, ShoppingBag, User2} from 'lucide-react';

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

type Viewport = 'desktop' | 'mobile';

export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  const {shop, menu} = header;

  return (
    <header className="fixed w-screen top-0 z-50">
      <div className="max-w-layout mx-auto flex items-center justify-between py-4 px-4 md:px-0">
        <NavLink
          className="text-2xl flex-1 text-gray-50"
          prefetch="intent"
          to="/"
          style={({isActive}) =>
            isActive ? {fontWeight: 900} : {fontWeight: 500}
          }
          end
        >
          {shop.name}
        </NavLink>
        <HeaderMenu
          menu={menu}
          viewport="desktop"
          primaryDomainUrl={header.shop.primaryDomain.url}
          publicStoreDomain={publicStoreDomain}
        />
        <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
      </div>
    </header>
  );
}

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
  viewport: Viewport;
  publicStoreDomain: HeaderProps['publicStoreDomain'];
}) {
  function closeAside(event: React.MouseEvent<HTMLAnchorElement>) {
    if (viewport === 'mobile') {
      event.preventDefault();
      window.location.href = event.currentTarget.href;
    }
  }

  return (
    <nav
      role="navigation"
      className="flex-1 hidden md:flex items-center justify-evenly text-gray-200 gap-6"
    >
      {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
        if (!item.url) return null;

        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;

        return (
          <NavLink
            end
            key={item.id}
            onClick={closeAside}
            prefetch="intent"
            style={({isActive}) =>
              isActive ? {fontWeight: 500} : {fontWeight: 300}
            }
            to={url}
            className="hover:no-underline hover:brightness-80 transition-all text-lg"
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

function HeaderCtas({
  isLoggedIn,
  cart,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'>) {
  return (
    <nav
      role="navigation"
      className="flex justify-end items-center gap-4 flex-1 text-gray-50"
    >
      <HeaderMenuMobileToggle />
      <NavLink prefetch="intent" to="/account">
        <Suspense fallback="Sign in">
          <Await resolve={isLoggedIn} errorElement="Sign in">
            {(isLoggedIn) =>
              isLoggedIn ? (
                <User2 className="h-6 w-6 hover:text-gray-300 transition-colors" />
              ) : (
                <LogIn className="h-6 w-6 hover:text-gray-300 transition-colors" />
              )
            }
          </Await>
        </Suspense>
      </NavLink>

      <SearchToggle />
      <CartToggle cart={cart} />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button
      onClick={() => open('mobile')}
      className="md:hidden text-gray-50 hover:text-gray-300 transition-colors cursor-pointer"
    >
      <Menu className="h-6 w-6" />
    </button>
  );
}

function SearchToggle() {
  const {open} = useAside();

  return (
    <button
      onClick={() => open('search')}
      className="text-gray-50 cursor-pointer hover:text-gray-300 transition-colors"
    >
      <Search className="h-6 w-6" />
    </button>
  );
}

function CartBadge({count}: {count: number | null}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <a
      href="/cart"
      onClick={(e) => {
        e.preventDefault();
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        } as CartViewPayload);
      }}
      className="relative inline-block text-gray-50 hover:text-gray-300 transition-colors"
    >
      <ShoppingBag className="h-6 w-6" />
      {count !== null && count > 0 ? (
        <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 h-3 w-3 bg-red-500 rounded-full" />
      ) : null}
    </a>
  );
}

function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
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
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
      items: [],
    },
  ],
};

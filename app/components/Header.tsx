import {Suspense, useEffect, useState} from 'react';
import {Await, NavLink} from '@remix-run/react';
import {type CartViewPayload, useAnalytics} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {LogIn, Menu, Search, ShoppingBag, User2, X} from 'lucide-react';
import {Button} from './ui/Button';
import {AnimatePresence} from 'framer-motion';
import {motion} from 'framer-motion';
import {Drawer} from './ui/Drawer';
import {PredictiveSearchForm, PredictiveSearchResults} from './Search';

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false); // State to manage menu visibility

  const {shop, menu} = header;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 250) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={`w-screen top-0 z-50 ${
        scrolled
          ? 'fixed bg-primary text-gray-900 shadow'
          : 'absolute bg-transparent text-gray-50'
      }`}
    >
      <div className="max-w-layout mx-auto flex items-center justify-center py-4 px-4 lg:px-0">
        <nav className="hidden md:flex flex-1">
          <HeaderMenu
            menu={menu}
            primaryDomainUrl={header.shop.primaryDomain.url}
            publicStoreDomain={publicStoreDomain}
          />
        </nav>
        <div className="flex-1 flex items-center justify-start md:justify-center font-semibold">
          <NavLink
            className="text-2xl text-inherit tracking-wider"
            prefetch="intent"
            to="/"
            end
          >
            {shop.name}
          </NavLink>
        </div>
        <HeaderCtas
          isLoggedIn={isLoggedIn}
          cart={cart}
          onMenuToggle={() => setMenuOpen(!menuOpen)}
        />
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{y: '-100%'}}
            animate={{y: 0}}
            exit={{y: '-100%'}}
            transition={{
              ease: 'anticipate',
              duration: 0.5,
            }}
            className="fixed top-0 left-0 w-full h-screen bg-primary text-gray-900 p-4 z-40 md:hidden"
          >
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="small"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            <HeaderMenu
              menu={menu}
              primaryDomainUrl={header.shop.primaryDomain.url}
              publicStoreDomain={publicStoreDomain}
            />
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
  publicStoreDomain: HeaderProps['publicStoreDomain'];
}) {
  return (
    <div className="flex-1 tracking-wide flex flex-col md:flex-row md:items-center md:justify-start">
      {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
        if (!item.url) return null;

        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;

        return (
          <NavLink
            key={item.id}
            prefetch="intent"
            to={url}
            className="px-2 hover:bg-gray-50/20 md:rounded hover:no-underline transition-all text-xl md:text-lg border-b border-gray-900 md:border-none py-4 md:py-1"
          >
            {item.title}
          </NavLink>
        );
      })}
    </div>
  );
}

function HeaderCtas({
  isLoggedIn,
  cart,
  onMenuToggle,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'> & {onMenuToggle: () => void}) {
  return (
    <nav
      role="navigation"
      className="flex justify-end items-center gap-1 flex-1 text-inherit"
    >
      <Button
        variant="ghost"
        size="small"
        className="md:hidden"
        onClick={onMenuToggle}
      >
        <Menu className="h-6 w-6" />
      </Button>

      <Button variant="ghost" size="small">
        <NavLink prefetch="intent" to="/account">
          <Suspense fallback="Sign in">
            <Await resolve={isLoggedIn} errorElement="Sign in">
              {(isLoggedIn) =>
                isLoggedIn ? (
                  <User2 className="h-6 w-6" />
                ) : (
                  <LogIn className="h-6 w-6" />
                )
              }
            </Await>
          </Suspense>
        </NavLink>
      </Button>

      <SearchToggle />
      <CartToggle cart={cart} />
    </nav>
  );
}

function SearchToggle() {
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

          <PredictiveSearchResults />
        </div>
      }
      desc="desc"
      header={<h1>Search</h1>}
      position="right"
      toggleIcon={<Search className="h-6 w-6" />}
    />
  );
}

function CartBadge({count}: {count: number | null}) {
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <Button
      variant="ghost"
      size="small"
      onClick={() => {
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        } as CartViewPayload);
      }}
    >
      <a href="/cart" className="relative inline-block">
        <ShoppingBag className="h-6 w-6" />
        {count !== null && count > 0 ? (
          <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs rounded-full h-3 w-3 flex items-center justify-center"></span>
        ) : null}
      </a>
    </Button>
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

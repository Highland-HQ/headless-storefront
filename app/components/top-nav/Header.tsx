import {Suspense, useEffect, useState} from 'react';
import {Await, useLocation} from '@remix-run/react';
import {type CartViewPayload, useAnalytics} from '@shopify/hydrogen';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {
  ChevronRight,
  LogIn,
  Menu,
  Search,
  ShoppingBag,
  User2,
  X,
} from 'lucide-react';
import {Button} from '../ui/Button';
import {AnimatePresence} from 'framer-motion';
import {motion} from 'framer-motion';
import {Drawer} from '../ui/Drawer';
import {PredictiveSearchForm, PredictiveSearchResults} from '../Search';
import {CartMain} from '../CartMain';
import {HeaderMenu} from './header/HeaderMenu';

export interface HeaderProps {
  header: any;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

const pathColorMapping: Record<string, string> = {
  '/': 'bg-secondary',
  '/collections': 'bg-secondary',
  '/collections/*': 'bg-secondary',
};

export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const {shop, menu} = header;

  const location = useLocation();

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

  const getHeaderTextClass = () => {
    for (const path in pathColorMapping) {
      const regex = new RegExp(`^${path.replace('*', '.*')}$`);
      if (regex.test(location.pathname)) {
        return pathColorMapping[path];
      }
    }
    return 'bg-secondary';
  };

  return (
    <header
      className={`w-screen top-0 z-50 ${
        scrolled ? 'fixed text-gray-50 shadow' : 'absolute text-gray-50'
      } ${getHeaderTextClass()}`}
    >
      <div className="max-w-layout mx-auto flex items-center justify-center py-4 px-4">
        <div className="flex-1 flex items-center justify-start font-semibold">
          <a className="text-2xl text-inherit tracking-wider" href="/">
            {shop.name}
          </a>
        </div>
        <nav className="hidden md:flex flex-1">
          <HeaderMenu
            menu={menu}
            primaryDomainUrl={header.shop.primaryDomain.url}
            publicStoreDomain={publicStoreDomain}
          />
        </nav>
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

function CartBadge({count}: {count: number | null}) {
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

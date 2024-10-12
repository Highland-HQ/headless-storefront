import {LogIn, Menu, User2} from 'lucide-react';
import {Button} from '../ui/Button';
import {NavProps} from './navTypes';
import {Suspense} from 'react';
import {Await} from '@remix-run/react';
import {CartToggle, SearchToggle} from './SearchToggle';

export const NavActions = ({
  isLoggedIn,
  cart,
  onMenuToggle,
}: Pick<NavProps, 'isLoggedIn' | 'cart'> & {onMenuToggle: () => void}) => {
  return (
    <nav
      role="navigation"
      className="flex justify-end items-center text-inherit"
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
        <a href="/account">
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
        </a>
      </Button>

      <SearchToggle />
      <CartToggle cart={cart} />
    </nav>
  );
};

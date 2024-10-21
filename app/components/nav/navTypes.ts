import {CartApiQueryFragment} from 'storefrontapi.generated';

export interface NavProps {
  header: any;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

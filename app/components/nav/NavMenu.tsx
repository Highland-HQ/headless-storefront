import {ChevronRight} from 'lucide-react';
import {Drawer} from '../ui/Drawer';
import {NavProps} from './navTypes';
import {SubMenuWomens} from './submenus/WomensSubmenu';
import {SubMenuMens} from './submenus/MensSubmenu';

export const NavMenu = ({
  menu,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  menu: NavProps['header']['menu'];
  primaryDomainUrl: NavProps['header']['shop']['primaryDomain']['url'];
  publicStoreDomain: NavProps['publicStoreDomain'];
}) => {
  return (
    <div className="flex-1 tracking-wide flex flex-col md:flex-row md:items-center md:justify-start">
      <Drawer
        position="left"
        content={<SubMenuWomens />}
        toggleIcon={
          <div className="flex items-center justify-start md:justify-center md:rounded transition-all text-xl md:text-lg border-b border-gray-900 md:border-none py-4 md:py-0">
            Womens <ChevronRight className="h-4 w-4 ml-2" />
          </div>
        }
      />

      <Drawer
        position="left"
        content={<SubMenuMens />}
        toggleIcon={
          <div className="flex items-center justify-start md:justify-center md:rounded transition-all text-xl md:text-lg border-b border-gray-900 md:border-none py-4 md:py-0">
            Mens <ChevronRight className="h-4 w-4 ml-2" />
          </div>
        }
      />

      {(menu || FALLBACK_HEADER_MENU).items.map((item: any) => {
        if (!item.url) return null;

        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;

        return (
          <a
            key={item.id}
            href={url}
            className="px-2 hover:bg-gray-50/20 md:rounded hover:no-underline transition-all text-xl md:text-lg border-b border-gray-900 md:border-none py-4 md:py-1"
          >
            {item.title}
          </a>
        );
      })}
    </div>
  );
};

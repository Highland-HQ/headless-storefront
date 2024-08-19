import {Drawer} from '~/components/ui/Drawer';
import {HeaderProps} from '../Header';
import {SubMenuAttrs, SubMenuLinks} from '../SubMenu';
import {mensSubMenuAttrs, womensSubMenuAttrs} from '../submenuLinks';
import {ChevronRight} from 'lucide-react';

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
      {[womensSubMenuAttrs, mensSubMenuAttrs].map((linkSet: SubMenuAttrs) => (
        <Drawer
          position="left"
          content={<SubMenuLinks links={linkSet.links} />}
          toggleIcon={
            <div className="flex items-center justify-start md:justify-center md:rounded transition-all text-xl md:text-lg border-b border-gray-900 md:border-none py-4 md:py-0">
              {linkSet.toggleText} <ChevronRight className="h-4 w-4 ml-2" />
            </div>
          }
        />
      ))}

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
}

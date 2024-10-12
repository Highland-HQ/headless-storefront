import {useState} from 'react';
import {NavMenu} from './NavMenu';
import {motion, AnimatePresence} from 'framer-motion';
import {NavProps} from './navTypes';
import {NavActions} from './NavActions';
import {Button} from '../ui/Button';
import {Info, X} from 'lucide-react';
import {SITE_ANNOUNCEMENT_TEXT} from '~/conf/SiteSettings';

export function Nav({header, isLoggedIn, cart, publicStoreDomain}: NavProps) {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const [isAnnouncementVisible, setIsAnnouncementVisible] =
    useState<boolean>(true);

  const {shop, menu} = header;

  return (
    <header className={`w-screen`}>
      <AnimatePresence>
        {isAnnouncementVisible && (
          <div className="bg-primary-50">
            <motion.div
              initial={{opacity: 1, height: 'auto'}}
              exit={{opacity: 0, height: 0}}
              transition={{duration: 0.3}}
              className="max-w-layout flex items-center justify-between text-base font-semibold py-2 mx-auto px-4 md:px-0"
            >
              <div className="flex items-center justify-start">
                <Info className="h-5 w-5 mr-2" />
                <span>{SITE_ANNOUNCEMENT_TEXT}</span>
              </div>

              <Button
                variant="ghost"
                size="small"
                onClick={() => setIsAnnouncementVisible(false)}
              >
                <X />
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="bg-secondary text-primary-50">
        <div className="flex flex-col max-w-layout mx-auto p-4 md:pr-4 md:pl-0 py-4 gap-2">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="small">
              <a
                className="text-lg md:text-2xl text-inherit tracking-wider font-semibold"
                href="/"
              >
                {shop.name}
              </a>
            </Button>

            <NavActions
              isLoggedIn={isLoggedIn}
              cart={cart}
              onMenuToggle={() => setMenuOpen(!menuOpen)}
            />
          </div>

          <hr className="hidden md:block" />

          <nav className="hidden md:flex flex-1">
            <NavMenu
              menu={menu}
              primaryDomainUrl={header.shop.primaryDomain.url}
              publicStoreDomain={publicStoreDomain}
            />
          </nav>
        </div>
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
            <NavMenu
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

import {ReactNode, useEffect, useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {X} from 'lucide-react';
import {Button} from './Button';

type DrawerPosition = 'top' | 'right' | 'left';

interface DrawerProps {
  header?: ReactNode;
  desc?: string;
  position?: DrawerPosition;
  content?: ReactNode;
  toggleIcon: ReactNode;
}

export const Drawer = ({
  header,
  desc,
  position = 'left',
  content,
  toggleIcon,
}: DrawerProps) => {
  const [drawerIsOpen, setDrawerIsOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const toggleDrawer = () => {
    setDrawerIsOpen(!drawerIsOpen);
  };

  const variants = {
    open: {
      width:
        position === 'right' || position === 'left'
          ? '45rem'
          : 'calc(100% - 2rem)',
      height: position === 'top' ? '25rem' : 'calc(100% - 2rem)',
      transition: {duration: 0.5, ease: 'anticipate'},
    },
    closed: {
      width:
        position === 'right' || position === 'left'
          ? '0px'
          : 'calc(100% - 2rem)',
      height: position === 'top' ? '0px' : 'calc(100% - 2rem)',
      transition: {duration: 0.5, ease: 'anticipate'},
    },
    mobileOpen: {
      width: '100vw',
      height: position === 'top' ? 'calc(100% - 2rem)' : '100%',
      transition: {duration: 0.5, ease: 'anticipate'},
    },
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <Button
        className="inline cursor-pointer"
        variant="ghost"
        size="small"
        onClick={toggleDrawer}
      >
        {toggleIcon}
      </Button>

      {/* Darkened Background */}
      <AnimatePresence>
        {drawerIsOpen && (
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 0.3}}
            exit={{opacity: 0}}
            transition={{duration: 0.3}}
            className="fixed top-0 left-0 z-40 h-screen w-screen bg-gray-950"
            onClick={toggleDrawer}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial="closed"
        animate={drawerIsOpen ? (isMobile ? 'mobileOpen' : 'open') : 'closed'}
        variants={variants}
        className={`fixed rounded-lg bg-primary text-gray-950 shadow-lg z-50 overflow-hidden m-0 ${
          position === 'top'
            ? 'top-0 left-0 right-0 md:m-4'
            : position === 'right'
            ? 'top-0 right-0 bottom-0 md:m-4'
            : 'top-0 left-0 bottom-0 md:m-4'
        }`}
      >
        <div className="flex justify-between items-center p-4">
          <span className="font-bold text-xl">{header}</span>
          <Button onClick={toggleDrawer} size="small" variant="ghost">
            <X className="h-6 w-6" />
          </Button>
        </div>

        <div className="overflow-y-auto max-h-[calc(100vh-10rem)] p-4">
          {content}
        </div>
      </motion.div>
    </>
  );
};

import {ReactNode, useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {X} from 'lucide-react';
import {Button} from './Button';

type DrawerPosition = 'top' | 'right';

interface DrawerProps {
  header: ReactNode;
  desc: string;
  position: DrawerPosition;
  content: ReactNode;
  toggleIcon: ReactNode;
}

export const Drawer = ({
  header,
  desc,
  position,
  content,
  toggleIcon,
}: DrawerProps) => {
  const [drawerIsOpen, setDrawerIsOpen] = useState<boolean>(false);

  const toggleDrawer = () => {
    setDrawerIsOpen(!drawerIsOpen);
  };

  const variants = {
    open: {
      width: position === 'right' ? '45rem' : 'calc(100% - 2rem)',
      height: position === 'top' ? 'calc(100% - 2rem)' : 'calc(100% - 2rem)',
    },
    closed: {
      width: position === 'right' ? '0' : 'calc(100% - 2rem)',
      height: position === 'top' ? '0' : 'calc(100% - 2rem)',
    },
  };

  return (
    <>
      <Button className="inline" onClick={toggleDrawer}>
        {toggleIcon}
      </Button>

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
        initial={'closed'}
        animate={drawerIsOpen ? 'open' : 'closed'}
        variants={variants}
        transition={{ease: 'anticipate', duration: 0.5}}
        className={`fixed rounded-lg bg-primary text-gray-950 shadow-lg z-50 overflow-hidden ${
          position === 'top'
            ? 'top-0 left-0 right-0'
            : 'top-0 right-0 bottom-0 m-4'
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <span className="font-bold text-xl uppercase">{header}</span>
          <Button onClick={toggleDrawer} size="small" variant="ghost">
            <X className="h-6 w-6" />
          </Button>
        </div>
      </motion.div>
    </>
  );
};

import {type FetcherWithComponents} from '@remix-run/react';
import {CartForm, type OptimisticCartLineInput} from '@shopify/hydrogen';
import {Button} from './ui/Button';
import {toast} from 'sonner';
import {useEffect} from 'react';
import {Loader, X} from 'lucide-react';
import {motion} from 'framer-motion';

export function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
}: {
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  lines: Array<OptimisticCartLineInput>;
  onClick?: () => void;
}) {
  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: FetcherWithComponents<any>) => {
        useEffect(() => {
          let toastId: string | number = '';

          if (fetcher.state === 'idle' && fetcher.data) {
            if (toastId) toast.dismiss(toastId);
            toast.custom(
              (t) => (
                <div className="flex items-center justify-between rounded-lg bg-secondary shadow-md border border-primary/10 text-primary p-4 tracking-widest font-semibold">
                  <span className="text-inherit">
                    Item added to cart successfully!
                  </span>
                  <Button
                    size="small"
                    variant="ghost"
                    className="text-inherit"
                    onClick={() => toast.dismiss(t)}
                  >
                    <X className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              ),
              {position: 'bottom-center'},
            );
          } else if (fetcher.state === 'submitting') {
            if (!toastId) {
              toastId = toast.custom(
                (t) => (
                  <div className="flex items-center justify-between rounded-lg bg-secondary shadow-md border border-primary/10 text-primary p-4 tracking-widest font-semibold">
                    <motion.div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingRight: '1rem',
                      }}
                    >
                      <motion.div
                        animate={{rotate: 360}}
                        transition={{
                          repeat: Infinity,
                          ease: 'linear',
                          duration: 1,
                        }}
                        style={{
                          width: '1rem',
                          height: '1rem',
                          transformOrigin: '50% 50%',
                        }}
                      >
                        <Loader className="h-4 w-4" />
                      </motion.div>
                    </motion.div>
                    <span className="text-inherit">Adding item to cart</span>
                    <Button
                      size="small"
                      variant="ghost"
                      className="text-inherit"
                      onClick={() => toast.dismiss(t)}
                    >
                      <X className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                ),
                {position: 'bottom-center', id: toastId},
              );
            }
          }

          return () => {
            if (toastId) toast.dismiss(toastId); // Cleanup on unmount
          };
        }, [fetcher.state, fetcher.data]);

        return (
          <>
            <input
              name="analytics"
              type="hidden"
              value={JSON.stringify(analytics)}
            />
            <Button
              variant="secondary"
              size="large"
              type="submit"
              onClick={onClick}
              disabled={disabled ?? fetcher.state !== 'idle'}
            >
              {children}
            </Button>
          </>
        );
      }}
    </CartForm>
  );
}

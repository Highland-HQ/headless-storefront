import {EarthLock, Headset, Package} from 'lucide-react';

export const InfoSection = () => {
  return (
    <div className="w-screen rounded-lg p-4">
      <div className="max-w-layout gap-4 w-full mx-auto grid grid-cols-1 lg:grid-cols-3">
        <div className="col-span-1 gap-4 flex justify-start items-center p-4 rounded-xl bg-secondary">
          <Package className="h-10 w-10 text-primary" />
          <div className="flex flex-col items-start tracking-wide">
            <h2 className="text-2xl font-bold text-primary">Free Shipping</h2>
            <p className="text-lg tracking-widest text-primary-50">
              On orders over $100
            </p>
          </div>
        </div>
        <div className="col-span-1 gap-4 flex justify-start items-center p-4 rounded-xl bg-secondary">
          <Headset className="h-10 w-10 text-primary" />
          <div className="flex flex-col items-start">
            <h2 className="text-2xl font-bold text-primary tracking-wide">
              24/7 Support
            </h2>
            <p className="text-lg tracking-widest text-primary-50">
              Contact us at support@highlandhq.com
            </p>
          </div>
        </div>
        <div className="col-span-1 gap-4 flex justify-start items-center p-4 rounded-xl bg-secondary">
          <EarthLock className="h-10 w-10 text-primary" />
          <div className="flex flex-col items-start">
            <h2 className="text-2xl font-bold tracking-wide text-primary">
              Secure Payments
            </h2>
            <p className="text-lg tracking-widest text-primary-50">
              Protected with secure encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

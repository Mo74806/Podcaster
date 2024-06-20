import { cn } from '@/lib/utils';
import { Loader } from 'lucide-react';
import React from 'react';

const LoaderSpinner = ({ fullHeight }: { fullHeight?: boolean }) => {
  return (
    <div className={cn('flex-center  py-5 w-full', { 'h-full': fullHeight })}>
      <Loader className="animate-spin text-orange-1 " size={30} />
    </div>
  );
};

export default LoaderSpinner;

import { cn } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';

const Header = ({ headerTitle, titleClassName }: { headerTitle?: string; titleClassName?: string }) => {
  return (
    <header className="flex items-cenetr justify-between">
      {headerTitle ? <h1 className={cn('texxt-18 font-bold', { 'text-white-1': titleClassName })}>{headerTitle}</h1> : null}
      <Link href="/discovery" className="text-16 font-semibold text-orange-1">
        See all
      </Link>
    </header>
  );
};

export default Header;

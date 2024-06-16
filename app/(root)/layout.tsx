import LeftSidebar from '@/components/LeftSidebar';
import MobileNav from '@/components/MobileNav';
import RightSidebar from '@/components/RightSidebar';
import Image from 'next/image';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex flex-col">
      <main className="relative flex bg-black-3">
        {/* left side bar */}
        <LeftSidebar />
        <section className="flex min-h-screen flex-1 flex-col px-4 sm:px-14">
          <div className="mx-auto flex w-full max-w-5xl flex-col max-sm:px-4">
            <div className="flex h-16 items-center justify-between md:hidden">
              <Image src="/icons/logo.svg" alt="menu icon" width={30} height={30} />
            </div>
            {/* Mobile Nav */}
            <MobileNav />
          </div>
          <div className="flex flex-col md:pb-14">{/* Toaster notification popup */}</div>
          {/* main content */}
          {children}
        </section>
        {/* right side bar */}
        <RightSidebar />
      </main>
    </div>
  );
}

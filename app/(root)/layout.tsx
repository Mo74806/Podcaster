import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import Image from 'next/image';
import { Toaster } from '@/components/ui/toaster';
import PodcastPlayer from '@/components/PodcastPlayer';
import MobileNav from '@/components/MobileNav';
import Nav from '@/components/Nav';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex flex-col pt-16 md:pt-0">
      <Nav />
      <main className="relative flex bg-black-3">
        {/* left side bar */}
        <LeftSidebar />
        <section className="flex min-h-screen flex-1 flex-col px-4 sm:px-14">
          {/* <div className="mx-auto flex w-full max-w-5xl flex-col max-sm:px-4">Mobile Nav</div> */}
          <div className="flex flex-col md:pb-14">
            {/* Toaster notification popup */}
            <Toaster />
          </div>

          {/* main content */}
          {children}
        </section>
        {/* right side bar */}
        <RightSidebar />
      </main>
      <PodcastPlayer />
    </div>
  );
}

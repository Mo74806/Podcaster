import type { PodcastCardProps } from '@/types';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

const Podcaster = ({ podcaster }: any) => {
  const router = useRouter();
  console.log(podcaster);
  return (
    <div
      className="cursor-pointer d-inline w-auto mb-6"
      onClick={() => {
        router.push(`/profile/${podcaster.clerkId}`);
      }}
    >
      <figure className="max-w-[174px] flex flex-col gap-2 d-inline">
        <Image
          style={{ borderRadius: '50%', objectFit: 'cover', background: '#f9763543' }}
          src={podcaster.imageUrl}
          width={174}
          height={174}
          alt={podcaster.name}
          className="aspect-square h-fit w-full rounded-xl 2xl:size-[200px]"
          onError={(e) => (e.currentTarget.src = `/images/notfound.jpg`)}
        />
        <div className="flex flex-col">
          <h1 className="text-16 truncate font-bold text-center text-orange-1">
            {podcaster.firstName} {podcaster.lastName}
          </h1>
          {podcaster.podcastCount && (
            <h2 className="text-12 truncate font-normal text-center capitalize text-white-4">{podcaster.podcastCount} podcasts</h2>
          )}
        </div>
      </figure>
    </div>
  );
};

export default Podcaster;

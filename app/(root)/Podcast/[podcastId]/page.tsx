'use client';

import EmptyState from '@/components/EmptyState';
import LoaderSpinner from '@/components/LoaderSpinner';
import PodcastCard from '@/components/PocastCard';
import PodcastDetailsPlayer from '@/components/PodcastDetailsPlayer';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import Image from 'next/image';
import React from 'react';

const PodcastDetails = ({ params: { podcastId } }: { params: { podcastId: Id<'podcasts'> } }) => {
  const { user } = useUser();
  const podcastDetails = useQuery(api.podcasts.getPodcastById, { podcastId });
  const similarPodcasts = useQuery(api.podcasts.getPodcastByVoiceType, { podcastId });
  const isOwner = user?.id === podcastDetails?.authorId;

  if (!similarPodcasts || !podcastDetails) return <LoaderSpinner fullHeight={true} />;

  return (
    <section className="flex w-full flex-col pb-12">
      <header className="mt-9 flex items-center justify-between">
        <h1 className="text-20 font-bold text-white-1">Podcast Details</h1>
        <figure className="flex gap-3">
          <Image src="/icons/headphone.svg" width={24} height={24} alt="headphone" />
          <h2 className="text-16 font-bold text-white-1">{podcastDetails?.views}</h2>
        </figure>
      </header>
      <PodcastDetailsPlayer isOwner={isOwner} podcastId={podcastId!} {...podcastDetails!} />
      <p className="text-white-2 text-16 pb-8 pt-[45px] font-medium max-md:text-center">{podcastDetails?.podcastDescription}</p>

      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-18 font-bold text-white-1">Transcription</h1>
          <p className="text-16 font-medium text-white-2">{podcastDetails?.voicePrompt}</p>
        </div>
        {podcastDetails?.imagePrompt && (
          <div className="flex flex-col gap-4">
            <h1 className="text-18 font-bold text-white-1">Thumbnail Prompt</h1>
            <p className="text-16 font-medium text-white-2">{podcastDetails?.imagePrompt}</p>
          </div>
        )}
      </div>
      <section className="mt-8 flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">Similar Podcasts</h1>

        {similarPodcasts && similarPodcasts.length > 0 ? (
          <div className="podcast_grid">
            {similarPodcasts?.map(({ _id, podcastTitle, podcastDescription, imageUrl }) => (
              <PodcastCard key={_id} imgUrl={imageUrl as string} title={podcastTitle} description={podcastDescription} podcastId={_id} />
            ))}
          </div>
        ) : (
          <>
            <EmptyState title="No similar podcasts found" buttonLink="/discover" buttonText="Discover more podcasts" />
          </>
        )}
      </section>
    </section>
  );
};

export default PodcastDetails;

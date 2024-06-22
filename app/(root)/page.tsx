'use client';
import PodcastCard from '@/components/PocastCard';
import { podcastData } from '@/constants';
import React from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import LoaderSpinner from '@/components/LoaderSpinner';
import Link from 'next/link';
import EmptyState from '@/components/EmptyState';

const Home = () => {
  const user = useUser();
  const trendingPodcasts = useQuery(api.podcasts.getTrendingPodcasts);
  const followingPodcasts = useQuery(api.podcasts.getFollowingPodcasts, { clerkId: user?.user?.id as string, page: 1, limit: 5 });
  // const followingPodcasts = getFollowingPodcasts({ clerkId: user?.user?.id, page: 1, limit: 5 });
  const categoryPodcasts = useMutation(api.podcasts.getPodcastByCategory);
  const cateoryPodcastList = categoryPodcasts({ category: 'fiction' });
  console.log(followingPodcasts);
  return (
    <div>
      <h1 className="text-20 font-bold text-white-1"> Trending Podcast</h1>
      {trendingPodcasts && trendingPodcasts.length > 0 ? (
        <div className="podcast_grid mt-12">
          {trendingPodcasts?.map(({ _id, podcastTitle, podcastDescription, imageUrl }) => (
            <PodcastCard key={_id} imgUrl={imageUrl as string} title={podcastTitle} description={podcastDescription} podcastId={_id} />
          ))}
        </div>
      ) : (
        <div className="text-center row flex justify-center">
          <div className="w-auto mx-auto">
            <LoaderSpinner />
          </div>
        </div>
      )}
      <div className="flex flex-between align-middle items-center w-100 pt-12">
        <h1 className="text-20 font-bold text-white-1 "> Following Podcast</h1>
        <Link href="/following-podcast" className="text-16    ms-auto font-semibold text-orange-1">
          See all
        </Link>
      </div>
      {followingPodcasts && followingPodcasts?.podcasts && followingPodcasts?.podcasts?.length > 0 ? (
        <div className="podcast_grid mt-12">
          {followingPodcasts && followingPodcasts?.podcasts && followingPodcasts?.podcasts?.length > 0 ? (
            followingPodcasts?.podcasts.map(({ _id, podcastTitle, podcastDescription, imageUrl }) => (
              <PodcastCard key={_id} imgUrl={imageUrl as string} title={podcastTitle} description={podcastDescription} podcastId={_id} />
            ))
          ) : (
            <EmptyState title="Follow More Podcaster & Listen" buttonLink="/discover" buttonText="Discover more podcasts" />
          )}
        </div>
      ) : (
        <div className="text-center row flex justify-center">
          <div className="w-auto mx-auto">
            <LoaderSpinner />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

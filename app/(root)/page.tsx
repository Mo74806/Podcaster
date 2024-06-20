'use client';
import PodcastCard from '@/components/PocastCard';
import { podcastData } from '@/constants';
import React from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';

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
      <div className="podcast_grid mt-12">
        {trendingPodcasts?.map(({ _id, podcastTitle, podcastDescription, imageUrl }) => (
          <PodcastCard key={_id} imgUrl={imageUrl as string} title={podcastTitle} description={podcastDescription} podcastId={_id} />
        ))}
      </div>
      <h1 className="text-20 font-bold text-white-1 pt-12"> Following Podcast</h1>
      <div className="podcast_grid mt-12">
        {followingPodcasts?.map(({ _id, podcastTitle, podcastDescription, imageUrl }) => (
          <PodcastCard key={_id} imgUrl={imageUrl as string} title={podcastTitle} description={podcastDescription} podcastId={_id} />
        ))}
      </div>
    </div>
  );
};

export default Home;

'use client';
import PodcastCard from '@/components/PocastCard';
import { podcastData } from '@/constants';
import React from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

const Home = () => {
  const trendingPodcasts = useQuery(api.podcasts.getTrendingPodcasts);
  const categoryPodcasts = useMutation(api.podcasts.getPodcastByCategory);
  const cateoryPodcastList = categoryPodcasts({ category: 'fiction' });
  return (
    <div>
      <h1 className="text-20 font-bold text-white-1"> Trending Podcast</h1>
      <div className="podcast_grid mt-12">
        {trendingPodcasts?.map(({ _id, podcastTitle, podcastDescription, imageUrl }) => (
          <PodcastCard key={_id} imgUrl={imageUrl as string} title={podcastTitle} description={podcastDescription} podcastId={_id} />
        ))}
      </div>
    </div>
  );
};

export default Home;

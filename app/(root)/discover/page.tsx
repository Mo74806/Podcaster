'use client';

import EmptyState from '@/components/EmptyState';
import LoaderSpinner from '@/components/LoaderSpinner';
import PodcastCard from '@/components/PocastCard';
import Podcaster from '@/components/Podcaster';
import Searchbar from '@/components/Searchbar';
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import React from 'react';

const Discover = ({ searchParams: { search } }: { searchParams: { search: string } }) => {
  const podcastsData = useQuery(api.podcasts.getPodcastBySearch, { search: search || '' });
  const podcasterData = useQuery(api.users.searchPodcasters, { search: search || '' });
  console.log(podcasterData);
  return (
    <div className="flex flex-col gap-9">
      <Searchbar />
      <div className="flex flex-col gap-9">
        <h1 className="text-20 font-bold text-white-1">
          {!search ? 'Discover Trending Podcasts' : 'Search results for '}
          {search && <span className="text-white-2">{search}</span>}
        </h1>
        {podcastsData ? (
          <>
            {podcastsData.length > 0 ? (
              <>
                <div className="podcast_grid">
                  {podcastsData?.map(({ _id, podcastTitle, podcastDescription, imageUrl }) => (
                    <PodcastCard key={_id} imgUrl={imageUrl!} title={podcastTitle} description={podcastDescription} podcastId={_id} />
                  ))}
                </div>
                <div className="podcast_grid">{podcasterData?.map((item: any) => <Podcaster podcaster={item} key={item._id} />)}</div>
              </>
            ) : (
              <EmptyState title="No results found" />
            )}
          </>
        ) : (
          <LoaderSpinner />
        )}
      </div>
    </div>
  );
};

export default Discover;

'use client';
import LoaderSpinner from '@/components/LoaderSpinner';
import Podcaster from '@/components/Podcaster';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import React, { useState, useEffect } from 'react';

import type { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { useRouter } from 'next/navigation';
import EmptyState from '@/components/EmptyState';
import PodcastCard from '@/components/PocastCard';

const FollowingPodcasts = ({ page: initialPage }: Params) => {
  const user = useUser();
  const router = useRouter();
  const [page, setPage] = useState<number>(parseInt(initialPage) || 1);
  const limit = 10;

  //   const followingPodcasts = useQuery(api.users.getFollowing, { page, limit, clerkId: user?.user?.id as string });
  const followingPodcasts = useQuery(api.podcasts.getFollowingPodcasts, { clerkId: user?.user?.id as string, page, limit });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    router.push(`/my-following?page=${newPage}`);
  };

  useEffect(() => {
    if (initialPage) {
      setPage(parseInt(initialPage));
    }
  }, [initialPage]);

  if (!followingPodcasts) {
    return <LoaderSpinner fullHeight={true} />;
  }

  const { podcasts, totalPages } = followingPodcasts;
  console.log(podcasts);
  //   totalPages = 10;/
  const getPaginationItems = () => {
    const items = [];
    const maxPageItems = 8; // Adjust this number to show more or fewer pages around the current page

    if (totalPages <= maxPageItems) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      items.push(1);
      if (page > 3) {
        items.push('...');
      }
      let start = Math.max(2, page - 1);
      let end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) {
        items.push(i);
      }

      if (page < totalPages - 2) {
        items.push('...');
      }
      items.push(totalPages);
    }
    return items;
  };

  const paginationItems = getPaginationItems();

  return (
    <div>
      <div className="flex flex-between align-middle items-center w-100 ">
        <h1 className="text-20 font-bold text-white-1 "> Following Podcast</h1>
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
      {totalPages > 1 && (
        <Pagination className=" mt-12 text-orange-1">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" onClick={() => handlePageChange(Math.max(page - 1, 1))} />
            </PaginationItem>
            {paginationItems.map((item: any, index) =>
              item === '...' ? (
                <PaginationItem key={index}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={item}>
                  <PaginationLink
                    className={` ${page === item ? 'border-orange-1 bg-orange-1 text-white-1 font-bold' : ' border-none text-orange-1 font-bold'}`}
                    href="#"
                    onClick={() => handlePageChange(item)}
                    isActive={page === item}
                  >
                    {item}
                  </PaginationLink>
                </PaginationItem>
              ),
            )}
            <PaginationItem>
              <PaginationNext href="#" onClick={() => handlePageChange(Math.min(page + 1, totalPages))} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default FollowingPodcasts;

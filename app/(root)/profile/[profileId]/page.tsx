'use client';
import LoaderSpinner from '@/components/LoaderSpinner';
import ProfileHeaderCard from '@/components/ProfileHeaderCard';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import React from 'react';

const Profile = ({ params: { profileId } }: { params: { profileId: Id<'users'> } }) => {
  const userDetails = useQuery(api.users.getUserById, { clerkId: profileId });
  const podcastsData = useQuery(api.podcasts.getPodcastByAuthorId, { authorId: profileId });
  console.log(userDetails);
  if (!userDetails || !podcastsData) return <LoaderSpinner fullHeight={true} />;
  return (
    <section className="mt-9 flex flex-col">
      <h1 className="text-20 font-bold text-white-1 max-md:text-center">Podcaster Profile</h1>
      <ProfileHeaderCard
        following={userDetails.follower}
        podcastData={podcastsData!}
        imageUrl={userDetails?.imageUrl!}
        userFirstName={userDetails?.firstName + ' ' + userDetails?.lastName}
        userId={userDetails.clerkId}
      />
    </section>
  );
};

export default Profile;

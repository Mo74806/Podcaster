'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useAudio } from '@/Providers/AudioProvider';
import { PodcastProps, ProfileCardProps } from '@/types';
import { Button } from './ui/button';
import LoaderSpinner from './LoaderSpinner';
import { useUser } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

const ProfileHeaderCard = ({ podcastData, imageUrl, userFirstName, userId, following }: ProfileCardProps) => {
  const { user } = useUser();
  const myProfileInfo = useQuery(api.users.getUserById, { clerkId: user?.id! });
  const [isFollowing, setIsFollowing] = useState(false);
  const { setAudio } = useAudio();
  const followUser = useMutation(api.users.followuser);
  const [randomPodcast, setRandomPodcast] = useState<PodcastProps | null>(null);
  const playRandomPodcast = () => {
    const randomIndex = Math.floor(Math.random() * podcastData.podcasts.length);
    setRandomPodcast(podcastData.podcasts[randomIndex]);
  };

  useEffect(() => {
    console.log(following);
    console.log(myProfileInfo);
    if (following && following.length > 0 && myProfileInfo && myProfileInfo._id && following.includes(myProfileInfo._id)) setIsFollowing(true);
  }, [myProfileInfo]);
  useEffect(() => {
    if (randomPodcast) {
      setAudio({
        title: randomPodcast.podcastTitle,
        audioUrl: randomPodcast.audioUrl || '',
        imageUrl: randomPodcast.imageUrl || '',
        author: randomPodcast.author,
        podcastId: randomPodcast._id,
      });
    }
  }, [randomPodcast, setAudio]);

  if (!imageUrl) return <LoaderSpinner />;

  return (
    <div className="mt-6 flex flex-col gap-6 max-md:items-center md:flex-row">
      <Image src={imageUrl} style={{ objectFit: 'cover' }} width={250} height={250} alt="Podcaster" className="aspect-square rounded-lg" />

      <div className="flex flex-col justify-center max-md:items-center">
        <div className="flex flex-col gap-2.5">
          <figure className="flex gap-2 max-md:justify-center">
            <Image src="/icons/verified.svg" width={15} height={15} alt="verified" />
            <h2 className="text-14 font-medium text-white-2">Verified Creator</h2>
          </figure>
          <h1 className="text-32 font-extrabold tracking-[-0.32px] text-white-1">{userFirstName}</h1>
        </div>
        <figure className="flex gap-3 py-6">
          <Image src="/icons/headphone.svg" width={24} height={24} alt="headphones" />
          <h2 className="text-16 font-semibold text-white-1">
            {podcastData?.listeners} &nbsp;
            <span className="font-normal text-white-2">Monthly Listeners</span>
          </h2>
        </figure>
        <div className="flex gap-1">
          {podcastData?.podcasts.length > 0 && (
            <Button onClick={playRandomPodcast} className="text-16 bg-orange-1 font-extrabold text-white-1">
              <Image src="/icons/Play.svg" width={20} height={20} alt="random play" /> &nbsp; Play a random podcast
            </Button>
          )}
          {myProfileInfo && user?.id !== userId && (
            <Button
              onClick={async () => {
                const response = await followUser({ clerkId: userId, followerId: user?.id! });
                console.log(response);
                response.status === 'success' && setIsFollowing((prev) => !prev);
              }}
              className="text-16 bg-orange-1 font-extrabold text-white-1"
            >
              {isFollowing ? 'UnFollow' : 'Follow'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeaderCard;

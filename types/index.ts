/* eslint-disable no-unused-vars */

import { Dispatch, SetStateAction } from 'react';

import { Id } from '@/convex/_generated/dataModel';

export interface EmptyStateProps {
  title: string;
  search?: boolean;
  buttonText?: string;
  buttonLink?: string;
}

export interface TopPodcastersProps {
  _id: Id<'users'> | any;
  _creationTime: number;
  email: string;
  imageUrl: string;
  clerkId: string;
  name: string;
  podcast: {
    podcastTitle: string;
    podcastId: Id<'podcasts'> | any;
    podcastImage: string;
  }[];
  totalPodcasts: number;
}

export interface PodcastProps {
  _id: Id<'podcasts'>;
  _creationTime: number;
  audioStorageId: Id<'_storage'> | null;
  user: Id<'users'>;
  podcastTitle: string;
  podcastDescription: string;
  audioUrl: string | null;
  imageUrl: string | null;
  imageStorageId: Id<'_storage'> | null;
  author: string;
  authorId: string;
  authorImageUrl: string;
  voicePrompt: string;
  imagePrompt: string | null;
  voiceType: string;
  audioDuration: number;
  views: number;
}

export interface ProfilePodcastProps {
  podcasts: PodcastProps[];
  listeners: number;
}

export type VoiceType = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer' | null;

export interface GeneratePodcastProps {
  voiceType: string;
  setAudio: Dispatch<SetStateAction<string>>;
  audio: string;
  setAudioStorageId: Dispatch<SetStateAction<Id<'_storage'> | null>>;
  voicePrompt: string;
  setVoicePrompt: Dispatch<SetStateAction<string>>;
  setAudioDuration: Dispatch<SetStateAction<number>>;
}

export interface GenerateThumbnailProps {
  setImage: Dispatch<SetStateAction<string>>;
  setImageStorageId: Dispatch<SetStateAction<Id<'_storage'> | null>>;
  image: string;
  imagePrompt: string;
  setImagePrompt: Dispatch<SetStateAction<string>>;
}

export interface LatestPodcastCardProps {
  imgUrl: string;
  title: string;
  duration: string;
  index: number;
  audioUrl: string;
  author: string;
  views: number;
  podcastId: Id<'podcasts'>;
}

export interface PodcastDetailPlayerProps {
  audioUrl: string;
  podcastTitle: string;
  author: string;
  isOwner: boolean;
  imageUrl: string;
  podcastId: Id<'podcasts'> | string;
  imageStorageId: Id<'_storage'> | string;
  audioStorageId: Id<'_storage'> | string;
  authorImageUrl: string;
  authorId: string;
}

export interface AudioProps {
  title: string;
  audioUrl: string;
  author: string;
  imageUrl: string;
  podcastId: string;
}

export interface AudioContextType {
  audio: AudioProps | undefined;
  setAudio: React.Dispatch<React.SetStateAction<AudioProps | undefined>>;
}

export interface PodcastCardProps {
  imagUrl: string;
  title: string;
  description: string;
  podcastId: Id<'podcasts'> | any;
}

export interface CarouselProps {
  fansLikeDetails: TopPodcastersProps[];
}

export interface ProfileCardProps {
  podcastData: ProfilePodcastProps;
  imageUrl: string;
  userFirstName: string;
  userId: Id<'podcasts'> | any;
  following:any
}

export type UseDotButtonType = {
  selectedIndex: number;
  scrollSnaps: number[];
  onDotButtonClick: (index: number) => void;
};

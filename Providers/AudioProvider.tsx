'use client';

import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { AudioContextType, AudioProps } from '@/types';
import { useMutation } from 'convex/react';
import { usePathname } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState } from 'react';

const AudioContext = createContext<AudioContextType | undefined>(undefined);

const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const [audio, setAudio] = useState<AudioProps | undefined>();
  const pathname = usePathname();
  const updateViews = useMutation(api.podcasts.updatePodcastViews);
  useEffect(() => {
    if (audio && audio.podcastId) updateViews({ podcastId: audio?.podcastId! as Id<'podcasts'> });
  }, [audio]);
  useEffect(() => {
    if (pathname === '/create-podcast') setAudio(undefined);
  }, [pathname]);

  return <AudioContext.Provider value={{ audio, setAudio }}>{children}</AudioContext.Provider>;
};

export const useAudio = () => {
  const context = useContext(AudioContext);

  if (!context) throw new Error('useAudio must be used within an AudioProvider');

  return context;
};

export default AudioProvider;

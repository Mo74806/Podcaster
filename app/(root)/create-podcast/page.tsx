import CreatePodcastForm from '@/components/CreatePodcastForm';
import React from 'react';

const CreatePodcast = () => {
  return (
    <section className="mt-10 pb-10 flex flex-col">
      <h1 className="text-20 font-bold text-white-1 ">Create Podcast</h1>
      <CreatePodcastForm />
    </section>
  );
};

export default CreatePodcast;

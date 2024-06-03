import PodcastCard from '@/components/PocastCard'
import { podcastData } from '@/constants'
import React from 'react'

const Home = () => {
  return (
    <div><h1 className='text-20 font-bold text-white-1'> Trending Podcast</h1>
    <div className="podcast_grid">

    {podcastData.map(({ id, title, description, imgURL })=>(
      <PodcastCard 
      key={id}
      imgUrl={imgURL}
      title={title}
      description={description}
      podcastId={id}
      />
    ))}
    </div>
    </div>
  )
}

export default Home
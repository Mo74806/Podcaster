import { ConvexError, v } from 'convex/values';

import { mutation, query } from './_generated/server';

// // create podcast mutation
export const createPodcast = mutation({
  args: {
    audioStorageId: v.id('_storage'),
    podcastTitle: v.string(),
    podcastDescription: v.string(),
    podcastCategory: v.string(),
    audioUrl: v.string(),
    imageUrl: v.string(),
    imageStorageId: v.id('_storage'),
    voicePrompt: v.string(),
    imagePrompt: v.string(),
    voiceType: v.string(),
    views: v.number(),
    audioDuration: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError('User not authenticated');
    }

    const user = await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('email'), identity.email))
      .collect();

    if (user.length === 0) {
      throw new ConvexError('User not found');
    }

    return await ctx.db.insert('podcasts', {
      audioStorageId: args.audioStorageId,
      user: user[0]._id,
      podcastTitle: args.podcastTitle,
      podcastDescription: args.podcastDescription,
      audioUrl: args.audioUrl,
      podcastCategory: args.podcastCategory,
      imageUrl: args.imageUrl,
      imageStorageId: args.imageStorageId,
      author: user[0].firstName + ' ' + user[0].lastName,
      authorId: user[0].clerkId,
      voicePrompt: args.voicePrompt,
      imagePrompt: args.imagePrompt,
      voiceType: args.voiceType,
      views: args.views,
      authorImageUrl: user[0].imageUrl,
      audioDuration: args.audioDuration,
    });
  },
});

// this query will get the podcast by the authorId.
export const getPodcastByAuthorId = query({
  args: {
    authorId: v.string(),
    // page: v.number(),
  },
  handler: async (ctx, args) => {
    const podcasts = await ctx.db
      .query('podcasts')
      .filter((q) => q.eq(q.field('authorId'), args.authorId))
      // .paginate(args.page)
      .collect();

    const totalListeners = podcasts.reduce((sum, podcast) => sum + podcast.views, 0);

    return { podcasts, listeners: totalListeners };
  },
});
// this mutation is required to generate the url after uploading the file to the storage.
export const getUrl = mutation({
  args: {
    storageId: v.id('_storage'),
  },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});
// this query will get the podcast by the podcastId.
export const getPodcastById = query({
  args: {
    podcastId: v.id('podcasts'),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.podcastId);
  },
});

// // this query will get all the podcasts based on the voiceType of the podcast , which we are showing in the Similar Podcasts section.
// export const getPodcastByVoiceType = query({
//   args: {
//     podcastId: v.id('podcasts'),
//   },
//   handler: async (ctx, args) => {
//     const podcast = await ctx.db.get(args.podcastId);

//     return await ctx.db
//       .query('podcasts')
//       .filter((q) => q.and(q.eq(q.field('voiceType'), podcast?.voiceType), q.neq(q.field('_id'), args.podcastId)))
//       .collect();
//   },
// });

// // this query will get all the podcasts.
// export const getAllPodcasts = query({
//   handler: async (ctx) => {
//     return await ctx.db.query('podcasts').order('desc').collect();
//   },
// });

// // this query will get the podcast by the podcastId.
// export const getPodcastById = query({
//   args: {
//     podcastId: v.id('podcasts'),
//   },
//   handler: async (ctx, args) => {
//     return await ctx.db.get(args.podcastId);
//   },
// });

// this query will get the podcasts based on the views of the podcast , which we are showing in the Trending Podcasts section.
export const getTrendingPodcasts = query({
  handler: async (ctx) => {
    const podcast = await ctx.db.query('podcasts').collect();

    return podcast.sort((a, b) => b.views - a.views).slice(0, 8);
  },
});

// // this query will get the podcast by the authorId.
// export const getPodcastByAuthorId = query({
//   args: {
//     authorId: v.string(),
//   },
//   handler: async (ctx, args) => {
//     const podcasts = await ctx.db
//       .query('podcasts')
//       .filter((q) => q.eq(q.field('authorId'), args.authorId))
//       .collect();

//     const totalListeners = podcasts.reduce((sum, podcast) => sum + podcast.views, 0);

//     return { podcasts, listeners: totalListeners };
//   },
// });

// this query will get the podcast by the search query.
export const getPodcastBySearch = query({
  args: {
    search: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.search === '') {
      return await ctx.db.query('podcasts').order('desc').collect();
    }

    const authorSearch = await ctx.db
      .query('podcasts')
      .withSearchIndex('search_author', (q) => q.search('author', args.search))
      .take(10);

    if (authorSearch.length > 0) {
      return authorSearch;
    }

    const titleSearch = await ctx.db
      .query('podcasts')
      .withSearchIndex('search_title', (q) => q.search('podcastTitle', args.search))
      .take(10);

    if (titleSearch.length > 0) {
      return titleSearch;
    }

    return await ctx.db
      .query('podcasts')
      .withSearchIndex('search_body', (q) => q.search('podcastDescription' || 'podcastTitle', args.search))
      .take(10);
  },
});

// this query will get all the podcasts based on the voiceType of the podcast , which we are showing in the Similar Podcasts section.
export const getPodcastByVoiceType = query({
  args: {
    podcastId: v.id('podcasts'),
  },
  handler: async (ctx, args) => {
    const podcast = await ctx.db.get(args.podcastId);

    return await ctx.db
      .query('podcasts')
      .filter((q) => q.and(q.eq(q.field('voiceType'), podcast?.voiceType), q.neq(q.field('_id'), args.podcastId)))
      .collect();
  },
});
export const getPodcastByCategory = mutation({
  args: {
    category: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('podcasts')
      .filter((q) => q.and(q.eq(q.field('podcastCategory'), args.category)))
      .collect();
  },
});

// this mutation will update the views of the podcast.
export const updatePodcastViews = mutation({
  args: {
    podcastId: v.id('podcasts') || v.any(),
  },
  handler: async (ctx, args) => {
    const podcast = await ctx.db.get(args.podcastId);

    if (!podcast) {
      throw new ConvexError('Podcast not found');
    }

    return await ctx.db.patch(args.podcastId, {
      views: podcast.views + 1,
    });
  },
});

// this mutation will delete the podcast.
export const deletePodcast = mutation({
  args: {
    podcastId: v.id('podcasts'),
    imageStorageId: v.id('_storage'),
    audioStorageId: v.id('_storage'),
  },
  handler: async (ctx, args) => {
    const podcast = await ctx.db.get(args.podcastId);

    if (!podcast) {
      throw new ConvexError('Podcast not found');
    }

    await ctx.storage.delete(args.imageStorageId);
    await ctx.storage.delete(args.audioStorageId);
    return await ctx.db.delete(args.podcastId);
  },
});

// this mutation will get your following's podcasts.
export const getFollowingPodcasts = query({
  args: {
    clerkId: v.string(),
    page: v.number(),
    limit: v.number(),
  },
  async handler(ctx, args) {
    const { clerkId, page, limit } = args;

    // Fetch the user by clerkId
    const user = await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('clerkId'), clerkId))
      .unique();

    // If user not found, throw an error
    if (!user) {
      throw new ConvexError('User not found');
    }

    // If the user has no following list, return an empty array with totalPages = 0
    if (!user.following || user.following.length === 0) {
      return { podcasts: [], totalPages: 0 };
    }

    // Array to collect results
    let followingPodcasts: any[] = [];

    // Function to fetch podcasts for each following user
    async function fetchPodcastsForUser(userId: any) {
      const podcasts = await ctx.db
        .query('podcasts')
        .filter((q) => q.eq(q.field('user'), userId))
        .collect();
      return podcasts;
    }

    // Fetch podcasts for each following user
    for (const userId of user.following) {
      const userPodcasts = await fetchPodcastsForUser(userId);
      followingPodcasts = [...followingPodcasts, ...userPodcasts];
    }

    // Sort the combined results by creation time (since we batched them)
    followingPodcasts.sort((a, b) => b._creationTime - a._creationTime);

    // Calculate total pages
    const totalPages = Math.ceil(followingPodcasts.length / limit);

    // Calculate skip count for pagination
    const skip = (page - 1) * limit;

    // Apply pagination on the combined sorted results
    const paginatedPodcasts = followingPodcasts.slice(skip, skip + limit);

    // Return the paginated podcasts and total pages
    return { podcasts: paginatedPodcasts, totalPages };
  },
});

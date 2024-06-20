import { ConvexError, v } from 'convex/values';

import { internalMutation, mutation, query } from './_generated/server';

export const getUserById = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('clerkId'), args.clerkId))
      .unique();

    if (!user) {
      throw new ConvexError('User not found');
    }
    console.log(user);
    return user;
  },
});

// this query is used to get the top user by podcast count. first the podcast is sorted by views and then the user is sorted by total podcasts, so the user with the most podcasts will be at the top.
export const getTopUserByPodcastCount = query({
  args: {},
  handler: async (ctx, args) => {
    const user = await ctx.db.query('users').collect();

    const userData = await Promise.all(
      user.map(async (u) => {
        const podcasts = await ctx.db
          .query('podcasts')
          .filter((q) => q.eq(q.field('authorId'), u.clerkId))
          .collect();

        const sortedPodcasts = podcasts.sort((a, b) => b.views - a.views);

        return {
          ...u,
          totalPodcasts: podcasts.length,
          podcast: sortedPodcasts.map((p) => ({
            podcastTitle: p.podcastTitle,
            podcastId: p._id,
            podcastImage: p.imageUrl,
          })),
        };
      }),
    );

    return userData.sort((a, b) => b.totalPodcasts - a.totalPodcasts);
  },
});

export const createUser = internalMutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    imageUrl: v.string(),
    name: v.string(),
    firstName: v.string(),
    lastName: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('users', {
      clerkId: args.clerkId,
      email: args.email,
      imageUrl: args.imageUrl,
      name: args.name,
      firstName: args.firstName,
      lastName: args.lastName,
    });
  },
});

export const updateUser = internalMutation({
  args: {
    clerkId: v.string(),
    imageUrl: v.string(),
    email: v.string(),
  },
  async handler(ctx, args) {
    const user = await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('clerkId'), args.clerkId))
      .unique();

    if (!user) {
      throw new ConvexError('User not found');
    }

    await ctx.db.patch(user._id, {
      imageUrl: args.imageUrl,
      email: args.email,
    });

    const podcast = await ctx.db
      .query('podcasts')
      .filter((q) => q.eq(q.field('authorId'), args.clerkId))
      .collect();

    await Promise.all(
      podcast.map(async (p) => {
        await ctx.db.patch(p._id, {
          authorImageUrl: args.imageUrl,
        });
      }),
    );
  },
});

export const deleteUser = internalMutation({
  args: { clerkId: v.string() },
  async handler(ctx, args) {
    const user = await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('clerkId'), args.clerkId))
      .unique();

    if (!user) {
      throw new ConvexError('User not found');
    }

    await ctx.db.delete(user._id);
  },
});
export const followuser = mutation({
  args: { clerkId: v.string(), followerId: v.string() },
  async handler(ctx, args) {
    try {
      const user = await ctx.db
        .query('users')
        .filter((q) => q.eq(q.field('clerkId'), args.clerkId))
        .unique();
      const follower = await ctx.db
        .query('users')
        .filter((q) => q.eq(q.field('clerkId'), args.followerId))
        .unique();

      if (!user || !follower) {
        throw new ConvexError('User not found');
      }

      const isFollowing = follower.following?.includes(user._id);
      const isFollowed = user.follower?.includes(follower._id);

      if (isFollowing) {
        // Remove user from follower's following list
        const updatedFollowing = follower?.following?.filter((id) => id !== user._id);
        await ctx.db.patch(follower._id, { following: updatedFollowing });

        // Remove follower from user's follower list
        const updatedFollowers = user?.follower?.filter((id) => id !== follower._id);
        await ctx.db.patch(user._id, { follower: updatedFollowers });
      } else {
        // Add user to follower's following list
        const updatedFollowing = follower.following ? [...follower.following, user._id] : [user._id];
        await ctx.db.patch(follower._id, { following: updatedFollowing });

        // Add follower to user's follower list
        const updatedFollowers = user.follower ? [...user.follower, follower._id] : [follower._id];
        await ctx.db.patch(user._id, { follower: updatedFollowers });
      }

      return { status: 'success' };
    } catch (e) {
      return { status: 'fail' };
      // return
    }
  },
});

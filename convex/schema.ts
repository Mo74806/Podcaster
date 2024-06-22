import { defineSchema, defineTable } from 'convex/server';
import { ConvexError, v } from 'convex/values';
import { query } from './_generated/server';

export default defineSchema({
  podcasts: defineTable({
    user: v.id('users'),
    podcastTitle: v.string(),
    podcastDescription: v.string(),
    audioUrl: v.optional(v.string()),
    audioStorageId: v.optional(v.id('_storage')),
    imageUrl: v.optional(v.string()),
    imageStorageId: v.optional(v.id('_storage')),
    author: v.string(),
    podcastCategory: v.string(),
    authorId: v.string(),
    authorImageUrl: v.string(),
    voicePrompt: v.string(),
    imagePrompt: v.string(),
    voiceType: v.string(),
    audioDuration: v.number(),
    views: v.number(),
  })
    .searchIndex('search_author', { searchField: 'author' })
    .searchIndex('search_title', { searchField: 'podcastTitle' })
    .searchIndex('search_body', { searchField: 'podcastDescription' }),
  users: defineTable({
    email: v.string(),
    imageUrl: v.string(),
    clerkId: v.string(),
    name: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    following: v.optional(v.array(v.id('users'))),
    follower: v.optional(v.array(v.id('users'))),
  }),
  // .searchIndex('search_name1', { searchField: 'firstName' })
  // .searchIndex('search_name2', { searchField: 'name' })
});

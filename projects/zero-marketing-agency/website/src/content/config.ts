import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    author: z.string().default('Zero'),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    category: z.string().default('General'),
    readTime: z.string().optional(),
  }),
});

export const collections = { blog };

import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// One Markdown file per post in src/content/blog/. The file name is the URL:
// src/content/blog/my-post.md -> /blog/my-post/
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    author: z.string().default('Dan Kauppi'),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(), // path under public/, used for social previews
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };

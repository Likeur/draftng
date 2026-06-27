import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()),
    author: z.string(),
  }),
});

const templates = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/templates' }),
  schema: z.object({
    name: z.string(),
    status: z.string(),
    category: z.string(),
    desc: z.string(),
    fullDesc: z.string(),
    tech: z.array(z.string()),
    github: z.string(),
    demo: z.string(),
    image: z.string(),
    date: z.string(),
    price: z.string(),
  }),
});

export const collections = { blog, templates };

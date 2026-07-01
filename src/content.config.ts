import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const writingBase = {
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  updated: z.coerce.date().optional(),
  topics: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  legacyPath: z.string().optional(),
};

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    ...writingBase,
    kind: z.literal('article').default('article'),
  }),
});

const notes = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/notes' }),
  schema: z.object({
    ...writingBase,
    status: z.enum(['seedling', 'growing', 'evergreen']).default('seedling'),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    status: z.enum(['active', 'maintained', 'archived', 'experiment']).default('experiment'),
    tech: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    links: z.object({
      github: z.string().url().optional(),
      website: z.string().url().optional(),
      article: z.string().optional(),
    }).default({}),
  }),
});

const topics = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/topics' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number().default(100),
    accent: z.string().default('blue'),
  }),
});

export const collections = { blog, notes, projects, topics };

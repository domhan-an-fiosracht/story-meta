import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const pageSchema = z
  .object({
    name: z.string().optional(),
    type: z.string().optional(),
    aka: z.array(z.string()).optional(),
    group: z.string().optional(),
    title: z.string().optional(),
    characters: z.array(z.string()).optional(),
    until: z.coerce.string().optional(),
  })
  .passthrough();

const characters = defineCollection({
  loader: glob({ pattern: "*.md", base: "./story-content/meta/characters" }),
  schema: pageSchema,
});

const places = defineCollection({
  loader: glob({ pattern: "*.md", base: "./story-content/meta/places" }),
  schema: pageSchema,
});

// Top-level meta pages: universe, timeline, voice, threads, lore specs, README.
const lore = defineCollection({
  loader: glob({ pattern: "*.md", base: "./story-content/meta" }),
  schema: pageSchema,
});

// Everything under story/: chapter files, scene files, story READMEs.
const stories = defineCollection({
  loader: glob({ pattern: ["*/**/*.md", "!*/meta/**"], base: "./story-content/story" }),
  schema: pageSchema,
});

// The universe repo's root README.
const root = defineCollection({
  loader: glob({ pattern: "README.md", base: "./story-content" }),
  schema: pageSchema,
});

export const collections = { characters, places, lore, stories, root };

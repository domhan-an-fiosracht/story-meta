import { getCollection } from "astro:content";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

// Theme precedence: THEME env override > the universe repo's own theme.css
// (copied in by scripts/link-story.mjs as themes/repo.css) > quiet default.
// Resolved from the project cwd, not import.meta.url: the bundler relocates
// this module at build time.
const repoTheme = existsSync(resolve(process.cwd(), "public/themes/repo.css"));
export const THEME =
  import.meta.env.THEME ?? process.env.THEME ?? (repoTheme ? "repo" : "default");

export async function universeName() {
  const roots = await getCollection("root");
  const readme = roots.find((e) => e.id === "readme");
  if (readme?.data?.name) return readme.data.name;
  const m = (readme?.body ?? "").match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : "Story";
}

export async function loreEntries() {
  return (await getCollection("lore")).filter((e) => e.id !== "readme");
}

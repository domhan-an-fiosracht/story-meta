import { getCollection } from "astro:content";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

// Theme precedence: THEME env override > the universe repo's own theme.css
// (copied in by scripts/link-story.mjs as themes/repo.css) > quiet default.
const repoTheme = existsSync(
  fileURLToPath(new URL("../../public/themes/repo.css", import.meta.url))
);
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

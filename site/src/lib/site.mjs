import { getCollection } from "astro:content";

export const THEME = import.meta.env.THEME ?? process.env.THEME ?? "default";

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

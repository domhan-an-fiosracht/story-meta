// Symlink the universe repo into the project so Vite/Astro can glob it,
// and pick up the repo's own theme (theme.css at the repo root) if it has one.
// Usage: STORY_PATH=/abs/path/to/universe-repo npm run build
import { copyFileSync, existsSync, lstatSync, rmSync, symlinkSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const target = process.env.STORY_PATH;
if (!target) {
  console.error("STORY_PATH is not set. Point it at a universe repo checkout.");
  process.exit(1);
}
const abs = resolve(target);
if (!existsSync(abs)) {
  console.error(`STORY_PATH does not exist: ${abs}`);
  process.exit(1);
}
const link = resolve(here, "..", "story-content");
if (existsSync(link) || (() => { try { lstatSync(link); return true; } catch { return false; } })()) {
  rmSync(link, { recursive: false, force: true });
}
symlinkSync(abs, link, "dir");
console.log(`story-content -> ${abs}`);

// A universe repo may ship its theme as theme.css at its root. Copy it in as
// the "repo" theme; site.mjs prefers it when no THEME env is set.
const repoTheme = resolve(abs, "theme.css");
const repoThemeDest = resolve(here, "..", "public", "themes", "repo.css");
if (existsSync(repoTheme)) {
  copyFileSync(repoTheme, repoThemeDest);
  console.log(`theme: ${repoTheme} -> public/themes/repo.css`);
} else {
  rmSync(repoThemeDest, { force: true });
}

// Shared mapping from universe-repo paths to site routes.
// A repo-relative path like "meta/characters/kaia.md" becomes "/characters/kaia/".
import path from "node:path";

export function storySlug(dirName) {
  // "01-crossing" -> "crossing"
  return dirName.replace(/^\d+-/, "");
}

export function routeForRepoPath(repoPath) {
  const p = repoPath.replace(/\\/g, "/").replace(/^\.\//, "");
  const anchorless = p; // anchors handled by caller
  let m;

  if ((m = anchorless.match(/^meta\/characters\/README\.md$/))) return "/characters/";
  if ((m = anchorless.match(/^meta\/characters\/(.+)\.md$/))) return `/characters/${m[1]}/`;
  if ((m = anchorless.match(/^meta\/places\/README\.md$/))) return "/places/";
  if ((m = anchorless.match(/^meta\/places\/(.+)\.md$/))) return `/places/${m[1]}/`;
  if ((m = anchorless.match(/^meta\/README\.md$/))) return "/meta/";
  if ((m = anchorless.match(/^meta\/(.+)\.md$/))) return `/${m[1]}/`;
  if ((m = anchorless.match(/^story\/([^/]+)\/README\.md$/))) return `/stories/${storySlug(m[1])}/`;
  // Scene files live under YYYY/ (and optionally YYYY-MM-DD/); the route is the filename.
  if ((m = anchorless.match(/^story\/([^/]+)\/\d{4}\/(?:\d{4}-\d{2}-\d{2}\/)?([^/]+)\.md$/)))
    return `/stories/${storySlug(m[1])}/${m[2]}/`;
  if ((m = anchorless.match(/^story\/([^/]+)\/(.+)\.md$/))) return `/stories/${storySlug(m[1])}/${m[2]}/`;
  if ((m = anchorless.match(/^README\.md$/))) return "/";
  return null;
}

// Resolve a relative markdown link from a source file (repo-relative) to a route.
export function resolveMdLink(sourceRepoPath, href) {
  if (/^[a-z]+:\/\//i.test(href) || href.startsWith("/") || href.startsWith("#")) return null;
  const [file, anchor] = href.split("#");
  if (!file.endsWith(".md")) return null;
  const dir = path.posix.dirname(sourceRepoPath.replace(/\\/g, "/"));
  const resolved = path.posix.normalize(path.posix.join(dir, file));
  const route = routeForRepoPath(resolved);
  if (!route) return null;
  return anchor ? `${route}#${anchor}` : route;
}

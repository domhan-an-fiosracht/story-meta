// Rewrites relative .md links in meta/story markdown into site routes,
// so the repo's own hyperlinks work unchanged on the site.
import { visit } from "unist-util-visit";
import path from "node:path";
import { resolveMdLink } from "./routes.mjs";

export default function remarkMdLinks() {
  return (tree, file) => {
    const abs = file.path ? file.path.replace(/\\/g, "/") : null;
    if (!abs) return;
    const marker = "/story-content/";
    const idx = abs.indexOf(marker);
    if (idx === -1) return;
    const repoPath = abs.slice(idx + marker.length);

    visit(tree, "link", (node) => {
      const rewritten = resolveMdLink(repoPath, node.url);
      if (rewritten) node.url = rewritten;
    });
  };
}

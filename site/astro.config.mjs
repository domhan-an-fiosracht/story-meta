import { defineConfig } from "astro/config";
import remarkMdLinks from "./src/lib/remark-md-links.mjs";

export default defineConfig({
  output: "static",
  trailingSlash: "always",
  markdown: {
    remarkPlugins: [remarkMdLinks],
  },
  vite: {
    resolve: { preserveSymlinks: false },
    server: { fs: { allow: [".."] } },
  },
});

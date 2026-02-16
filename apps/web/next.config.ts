import type { NextConfig } from "next";

const repoName = "invest-guide";
const pagesBasePath = process.env.PAGES_BASE_PATH ?? "";
const isStaticExport = process.env.GITHUB_ACTIONS === "true" || process.env.NEXT_OUTPUT_MODE === "export";

const nextConfig: NextConfig = {
  transpilePackages: ["@invest-guide/core", "@invest-guide/db"],
  output: isStaticExport ? "export" : undefined,
  trailingSlash: isStaticExport,
  basePath: pagesBasePath,
  assetPrefix: pagesBasePath ? `${pagesBasePath}/` : undefined,
  images: {
    unoptimized: true
  },
  env: {
    NEXT_PUBLIC_REPO_NAME: repoName
  }
};

export default nextConfig;

import * as path from "path";
import type { GatsbyNode } from "gatsby";

export const onCreateWebpackConfig: GatsbyNode["onCreateWebpackConfig"] = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
        "@/components": path.resolve(__dirname, "src/components"),
        "@/lib/utils": path.resolve(__dirname, "src/lib/utils"),
      },
    },
  });
};

export const onCreateNode: GatsbyNode["onCreateNode"] = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type === "ProjectsJson") {
    const parent = getNode(node.parent as string) as any;
    // e.g., src/data/en/projects.json -> relativeDirectory === "en"
    const locale = parent?.relativeDirectory?.split("/")[0] || "en";
    createNodeField({ node, name: "locale", value: locale });
  }
};

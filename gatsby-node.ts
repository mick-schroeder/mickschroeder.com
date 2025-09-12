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
    const locale = parent?.relativeDirectory?.split("/")[0] || "en";
    createNodeField({ node, name: "locale", value: locale });
  }
  if ((node as any).internal?.type === "SocialsJson") {
    const parent = getNode((node as any).parent as string) as any;
    const locale = parent?.relativeDirectory?.split("/")[0] || "en";
    createNodeField({ node: node as any, name: "locale", value: locale });
  }
};

export const createSchemaCustomization: GatsbyNode["createSchemaCustomization"] = ({ actions }) => {
  const { createTypes } = actions;
  createTypes(`
    type ProjectsJsonLinks { label: String, url: String }
    type ProjectsJsonFields { locale: String }
    type ProjectsJson implements Node {
      slug: String
      title: String
      description: String
      icon: String
      links: [ProjectsJsonLinks]
      repo: String
      homepage: String
      language: String
      license: String
      fields: ProjectsJsonFields
    }
    type SocialsJsonFields { locale: String }
    type SocialsJson implements Node {
      title: String
      cta: String
      url: String
      icon: String
      fields: SocialsJsonFields
    }
  `);
};

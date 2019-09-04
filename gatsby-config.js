const config = require("./config");
const withDefaults = require(`./utils/default-options`);

module.exports = themeOptions => {
  const options = withDefaults(themeOptions);
  const pathPrefix = options.basePath === "/" ? "" : options.basePath || "";
  return {
    pathPrefix: options.basePath,
    siteMetadata: {
      siteUrl: config.siteUrl + pathPrefix
    },
    plugins: [
      "gatsby-plugin-react-helmet",
      "gatsby-plugin-styled-components",
      "gatsby-plugin-sharp",
      {
        resolve: `gatsby-source-filesystem`,
        options: {
          path: options.contentPath || `content/posts`,
          name: options.contentPath || `content/posts`
        }
      },
      {
        resolve: `gatsby-source-filesystem`,
        options: {
          path: options.assetPath || `content/assets`,
          name: options.assetPath || `content/assets`
        }
      },
      {
        resolve: "gatsby-plugin-mdx",
        options: {
          gatsbyRemarkPlugins: [
            {
              resolve: "gatsby-remark-external-links",
              options: {
                target: "_blank",
                rel: "nofollow noopener noreferrer"
              }
            },
            {
              resolve: "gatsby-remark-images",
              options: {
                maxWidth: 830,
                quality: 90,
                withWebp: true,
                linkImagesToOriginal: false
              }
            },
            {
              resolve: "gatsby-remark-autolink-headers",
              options: {
                maintainCase: false
              }
            }
          ],
          plugins: [`gatsby-remark-images`, `gatsby-remark-autolink-headers`]
        }
      },
      "gatsby-plugin-catch-links",
      "gatsby-plugin-sitemap",
      "gatsby-plugin-lodash",
      {
        resolve: "gatsby-plugin-manifest",
        options: {
          name: config.siteTitleAlt,
          short_name: config.siteTitleManifest,
          description: config.siteDescription,
          start_url: config.pathPrefix,
          background_color: config.backgroundColor,
          theme_color: config.themeColor,
          display: "standalone",
          icon: config.favicon
        }
      },
      "gatsby-plugin-offline",
      "gatsby-plugin-netlify"
    ]
  };
};

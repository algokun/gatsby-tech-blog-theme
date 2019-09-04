const _ = require("lodash");
const fs = require("fs");
const path = require("path");
const mkdirp = require("mkdirp");
const withDefaults = require(`./utils/default-options`);
const { urlResolve } = require(`gatsby-core-utils`);
// graphql function doesn't throw an error so we have to check to check for the result.errors to throw manually
const wrapper = promise =>
  promise.then(result => {
    if (result.errors) {
      throw result.errors;
    }
    return result;
  });

// Make sure the data directory exists
exports.onPreBootstrap = ({ store, reporter }, themeOptions) => {
  const { program } = store.getState();
  const { contentPath, assetPath } = withDefaults(themeOptions);

  const dirs = [
    path.join(program.directory, contentPath),
    path.join(program.directory, assetPath)
  ];

  dirs.forEach(dir => {
    reporter.info(`Initializing ${dir} directory`);
    if (!fs.existsSync(dir)) {
      mkdirp.sync(dir);
    }
  });
};

exports.onCreateNode = ({ node, actions }, themeOptions) => {
  const { createNodeField } = actions;
  const { basePath } = withDefaults(themeOptions);
  let slug;
  if (node.internal.type === "Mdx") {
    if (
      Object.prototype.hasOwnProperty.call(node, "frontmatter") &&
      Object.prototype.hasOwnProperty.call(node.frontmatter, "slug")
    ) {
      // urlPath = `${_.kebabCase(node.frontmatter.slug)}`;
      slug = urlResolve(basePath, node.frontmatter.slug);
    } else if (
      Object.prototype.hasOwnProperty.call(node, "frontmatter") &&
      Object.prototype.hasOwnProperty.call(node.frontmatter, "title")
    ) {
      // urlPath = `${_.kebabCase(node.frontmatter.title)}`;
      slug = urlResolve(basePath, node.frontmatter.title);
    }
    createNodeField({ node, name: "slug", value: slug });
    createNodeField({ node, name: "path", value: basePath });
  }
};

exports.createPages = async ({ graphql, actions }, themeOptions) => {
  const { createPage } = actions;
  const { basePath } = withDefaults(themeOptions);
  const postTemplate = require.resolve("./src/templates/post.js");
  const categoryTemplate = require.resolve("./src/templates/category.js");
  const postListQuery = require.resolve("./src/templates/posts-query.js");
  const categoryListQuery = require.resolve(
    "./src/templates/categories-query.js"
  );

  const result = await wrapper(
    graphql(`
      {
        allMdx(sort: { fields: [frontmatter___date], order: DESC }) {
          nodes {
            fields {
              slug
            }
            frontmatter {
              title
              categories
            }
          }
        }
      }
    `)
  );

  const posts = result.data.allMdx.nodes;

  posts.forEach((n, index) => {
    const next = index === 0 ? null : posts[index - 1];
    const prev = index === posts.length - 1 ? null : posts[index + 1];

    createPage({
      path: n.fields.slug,
      component: postTemplate,
      context: {
        slug: n.fields.slug,
        home: basePath,
        prev,
        next
      }
    });
  });

  const categorySet = new Set();

  _.each(posts, n => {
    if (_.get(n, "frontmatter.categories")) {
      n.frontmatter.categories.forEach(cat => {
        categorySet.add(cat);
      });
    }
  });

  // create page for categories
  const categoryPath = urlResolve(basePath, `/categories`);
  createPage({
    path: categoryPath,
    component: categoryListQuery,
    contentPath: {
      path: categoryPath,
      home: basePath
    }
  });

  const categories = Array.from(categorySet);

  categories.forEach(category => {
    const slug = `categories/${_.kebabCase(category)}`;
    const path = urlResolve(basePath, slug);
    createPage({
      path,
      component: categoryTemplate,
      context: {
        category,
        home: basePath,
        categoryPath
      }
    });
  });

  //create page for all posts

  createPage({
    path: basePath,
    component: postListQuery,
    contentPath: {
      path: basePath
    }
  });
};

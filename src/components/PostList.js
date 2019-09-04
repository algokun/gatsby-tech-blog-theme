import React from "react";
import PropTypes from "prop-types";

import { Layout, Article, Wrapper, SectionTitle } from "./index";
import { Hero, PostListContent } from "./StyledComponents";

const IndexPage = ({
  data: {
    allMdx: { nodes: posts },
    site: {
      siteMetadata: { author }
    }
  }
}) => (
  <Layout>
    <Wrapper>
      <Hero>
        <h1>Blog</h1>
        <p>Writings by {author}</p>
      </Hero>
      <PostListContent>
        <SectionTitle>Latest stories</SectionTitle>
        {posts.map(post => (
          <Article
            title={post.frontmatter.title}
            date={post.frontmatter.date}
            excerpt={post.excerpt}
            timeToRead={post.timeToRead}
            slug={post.fields.slug}
            categories={post.frontmatter.categories}
            path={post.fields.path}
            key={post.fields.slug}
          />
        ))}
      </PostListContent>
    </Wrapper>
  </Layout>
);

export default IndexPage;

IndexPage.propTypes = {
  data: PropTypes.shape({
    allMdx: PropTypes.shape({
      nodes: PropTypes.array.isRequired
    })
  }).isRequired
};

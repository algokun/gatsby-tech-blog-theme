import React from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import { Link, graphql } from "gatsby";
import styled from "styled-components";

import {
  Layout,
  Wrapper,
  Header,
  Subline,
  Article,
  SectionTitle
} from "../components";
import config from "../../config";

const Content = styled.div`
  grid-column: 2;
  box-shadow: 0 4px 120px rgba(0, 0, 0, 0.1);
  border-radius: 1rem;
  padding: 2rem 4rem;
  background-color: ${props => props.theme.colors.bg};
  z-index: 9000;
  margin-top: -3rem;
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 3rem 3rem;
  }
  @media (max-width: ${props => props.theme.breakpoints.phone}) {
    padding: 2rem 1.5rem;
  }
`;

const Category = ({
  pageContext: { category, home, categoryPath },
  data: { allMdx }
}) => {
  const { nodes, totalCount } = allMdx;
  const subline = `${totalCount} post${
    totalCount === 1 ? "" : "s"
  } tagged with "${category}"`;

  return (
    <Layout>
      <Wrapper>
        <Helmet title={`Category: ${category} | ${config.siteTitle}`} />
        <Header>
          <Link to={home}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="#FFF"
            >
              <path d="M11.67 3.87L9.9 2.1 0 12l9.9 9.9 1.77-1.77L3.54 12z" />
              <path fill="none" d="M0 0h24v24H0z" />
            </svg>
          </Link>
        </Header>
        <Content>
          <SectionTitle>Category &ndash; {category}</SectionTitle>
          <Subline sectionTitle>
            {subline} (See <Link to={categoryPath}>all categories</Link>)
          </Subline>
          {nodes.map(post => (
            <Article
              title={post.frontmatter.title}
              date={post.frontmatter.date}
              excerpt={post.excerpt}
              timeToRead={post.timeToRead}
              slug={post.fields.slug}
              categories={post.frontmatter.categories}
              path={home}
              key={post.fields.slug}
            />
          ))}
        </Content>
      </Wrapper>
    </Layout>
  );
};

export default Category;

Category.propTypes = {
  pageContext: PropTypes.shape({
    category: PropTypes.string.isRequired
  }).isRequired,
  data: PropTypes.shape({
    allMdx: PropTypes.shape({
      nodes: PropTypes.array.isRequired,
      totalCount: PropTypes.number.isRequired
    })
  }).isRequired
};

export const postQuery = graphql`
  query CategoryPage($category: String!) {
    allMdx(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { categories: { eq: $category } } }
    ) {
      totalCount
      nodes {
        frontmatter {
          title
          date(formatString: "MM/DD/YYYY")
          categories
        }
        fields {
          slug
        }
        excerpt(pruneLength: 200)
        timeToRead
      }
    }
  }
`;

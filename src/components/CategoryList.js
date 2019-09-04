import React from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import { Link } from "gatsby";
import styled from "styled-components";
import kebabCase from "lodash/kebabCase";
import { Layout, Wrapper, Header, SectionTitle } from "./index";
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

const Title = styled.h3`
  position: relative;
  text-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
  margin-bottom: 0.75rem;
`;

const Category = ({
  data: {
    allMdx: { group }
  },
  path,
  home
}) => (
  <Layout>
    <Wrapper>
      <Helmet title={`Categories | ${config.siteTitle}`} />
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
        {console.log(path, "skjgh")}
        <SectionTitle>Categories</SectionTitle>
        {group.map(category => {
          return (
            <Title key={category.fieldValue}>
              <Link to={`${path}/${kebabCase(category.fieldValue)}`}>
                {category.fieldValue}
              </Link>{" "}
              ({category.totalCount})
            </Title>
          );
        })}
      </Content>
    </Wrapper>
  </Layout>
);

export default Category;

Category.propTypes = {
  data: PropTypes.shape({
    allMdx: PropTypes.shape({
      group: PropTypes.array.isRequired
    })
  }).isRequired
};

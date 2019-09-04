import React, { Component } from "react";
import { Index } from "elasticlunr";
import { Layout, Article, Wrapper, SectionTitle } from "./index";
import { PostListContent, Hero } from "./StyledComponents";

export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: ``,
      results: []
    };
  }

  render() {
    return (
      <Layout>
        <Wrapper>
          <Hero>
            <input
              type="text"
              value={this.state.query}
              onChange={this.search}
              placeholder="search"
            />
            <br />
            <br />
            Search By{" "}
            <a href="https://www.gatsbyjs.org/packages/@gatsby-contrib/gatsby-plugin-elasticlunr-search">
              Elastic Lunr
            </a>
          </Hero>
          <PostListContent>
            <SectionTitle>Results</SectionTitle>
            {this.state.results.map(page => (
              <Article
                title={page.title}
                date={page.date}
                excerpt={page.excerpt}
                timeToRead={page.timeToRead}
                slug={page.slug}
                categories={page.categories}
                path={page.path}
                key={page.slug}
              />
            ))}
          </PostListContent>
        </Wrapper>
      </Layout>
    );
  }
  getOrCreateIndex = () =>
    this.index
      ? this.index
      : // Create an elastic lunr index and hydrate with graphql query results
        Index.load(this.props.searchIndex);

  search = evt => {
    const query = evt.target.value;
    this.index = this.getOrCreateIndex();
    this.setState({
      query,
      // Query the index with search string to get an [] of IDs
      results: this.index
        .search(query, {})
        // Map over each ID and return the full document
        .map(({ ref }) => this.index.documentStore.getDoc(ref))
    });
  };
}

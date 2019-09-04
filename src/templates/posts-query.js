import { graphql } from "gatsby";
import PostsPage from "../components/PostList";

export default PostsPage;

export const IndexQuery = graphql`
  query IndexQuery {
    allMdx(sort: { fields: [frontmatter___date], order: DESC }) {
      nodes {
        fields {
          slug
          path
        }
        frontmatter {
          title
          date(formatString: "MM/DD/YYYY")
          categories
        }
        excerpt(pruneLength: 200)
        timeToRead
      }
    }
    site{
      siteMetadata{
        author
      }
    }
  }
`;

import { graphql } from "gatsby";
import CategoriesList from "../components/CategoryList";

export default CategoriesList;
export const postQuery = graphql`
  query CategoriesPage {
    allMdx {
      group(field: frontmatter___categories) {
        fieldValue
        totalCount
      }
    }
  }
`;

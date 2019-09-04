import React from "react";
import { useStaticQuery, graphql } from "gatsby";

import Search from "../components/SearchComponent";

const Header = () => {
  const data = useStaticQuery(graphql`
    query SearchIndexQuery {
      siteSearchIndex {
        index
      }
    }
  `);
  return <Search searchIndex={data.siteSearchIndex.index} />;
};

export default Header;

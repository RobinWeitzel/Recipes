module.exports = {
  siteMetadata: {
    title: "My cookbook",
  },
  plugins: [
    "gatsby-plugin-sharp",
    "gatsby-plugin-sitemap",
    "gatsby-transformer-sharp",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: "./src/images/",
      },
      __key: "images",
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "recipes",
        path: "./src/recipes/",
      },
      __key: "images",
    },
  ],
};

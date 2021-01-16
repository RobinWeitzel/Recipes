module.exports = {
  siteMetadata: {
    title: "My cookbook",
  },
  plugins: [
    "gatsby-plugin-sharp",
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
    `gatsby-transformer-json`,
    {
      resolve: 'gatsby-plugin-load-script',
      options: {
        src: 'https://unpkg.com/github-api@3.3.0/dist/GitHub.bundle.min.js',
      },
    },
  ],
};

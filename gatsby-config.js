/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/gatsby-config/
 */

module.exports = {
  /* Your site config here */
  siteMetadata: {
    title: `soft light`,
    siteUrl: `https://softlight.dev/`,
    description: `Free video conference lighting from your screen.`,
    author: `Stephen Gray`,
    background_color: "#303030",
    display: "fullscreen",
    scope: "/",
    theme_color: "#e9e9e9",
    icon: `/icon.png`,
    shortcuts: [
      {
        name: "soft light",
        short_name: "soft light",
        description: `Free video conference lighting from your screen.`,
        url: "https://softlight.dev/?source=pwa",
        icons: [{ src: "/icon.png" }],
      },
    ],
  },
  plugins: [
    `gatsby-plugin-sass`,
    `gatsby-plugin-postcss`,
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-offline`,
  ],
}

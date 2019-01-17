/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const siteConfig = {
  title: "Flux",
  tagline: "Application architecture for building user interfaces",
  url: "http://facebook.github.io/flux/",
  baseUrl: "/flux/",
  projectName: "flux",

  headerLinks: [
    { doc: "overview", label: "Docs" },
    { href: "/flux/help", label: "Support" },
    { href: "https://github.com/facebook/flux", label: "GitHub" }
  ],

  headerIcon: "img/logo/flux-logo-white.svg",
  footerIcon: "img/logo/flux-logo-white.svg",
  favicon: "img/favicon.png",

  colors: {
    primaryColor: "#318435",
    secondaryColor: "#205C3B"
  },

  fonts: {
    myFont: [
      "proxima-nova",
      "Helvetica Neue",
      "Helvetica",
      "Arial",
      "sans-serif"
    ]
  },

  copyright: `Copyright © 2014-${new Date().getFullYear()} Facebook Inc.`,

  highlight: {
    theme: "atom-one-dark"
  },

  scripts: ["https://buttons.github.io/buttons.js"],
  onPageNav: "separate",
  cleanUrl: true,
  ogImage: "img/docusaurus.png",
  twitterImage: "img/docusaurus.png",
  enableUpdateTime: true,
  repoUrl: 'https://github.com/facebook/flux',
};

module.exports = siteConfig;

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  title: 'Flux',
  tagline: 'Application architecture for building user interfaces',
  url: 'https://facebook.github.io',
  baseUrl: '/flux/',
  favicon: 'img/favicon.ico',
  organizationName: 'facebook',
  projectName: 'flux',
  themeConfig: {
    algolia: {
      apiKey: '6dab6b592e7b8e994dc2cff2aadc3cf2',
      indexName: 'flux',
    },
    navbar: {
      title: 'Flux',
      logo: {
        alt: 'Flux Logo',
        src: 'img/flux-logo-color.svg',
      },
      links: [
        { to: 'docs/overview', label: 'Docs', position: 'left' },
        { to: 'support', label: 'Support', position: 'left' },
        {
          href: 'https://github.com/facebook/flux',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      logo: {
        alt: 'Facebook Open Source Logo',
        src: 'https://docusaurus.io/img/oss_logo.png',
      },
      copyright: `Copyright © ${new Date().getFullYear()} Facebook, Inc. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          path: '../docs',
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/facebook/flux/edit/master/docs/',
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  title: 'Flux',
  tagline: 'Application architecture for building user interfaces',
  url: 'https://facebookarchive.github.io',
  baseUrl: '/flux/',
  favicon: 'img/favicon.ico',
  organizationName: 'facebookarchive',
  projectName: 'flux',
  themeConfig: {
    announcementBar: {
      id: 'support_ukraine',
      content:
        'The Flux project has been archived and no further changes will be made.',
      backgroundColor: '#20232a',
      textColor: '#fff',
      isCloseable: false,
    },
    algolia: {
      appId: 'YDWP2C57PH',
      apiKey: '05bee0fdd678621b57cf7f8881751543',
      indexName: 'flux',
    },
    navbar: {
      title: 'Flux',
      logo: {
        alt: 'Flux Logo',
        src: 'img/flux-logo-color.svg',
      },
      items: [
        {to: 'docs/overview', label: 'Docs', position: 'left'},
        {to: 'support', label: 'Support', position: 'left'},
        {
          href: 'https://github.com/facebookarchive/flux',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      logo: {
        alt: 'Facebook Open Source Logo',
        src: 'https://docusaurus.io/img/meta_opensource_logo_negative.svg',
      },
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Introduction',
              to: 'docs/overview',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/flux',
            },
          ],
        },
        {
          title: 'Social',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/facebookarchive/flux',
            },
          ],
        },
        {
          title: 'Legal',
          // Please do not remove the privacy and terms, it's a legal requirement.
          items: [
            {
              label: 'Privacy',
              href: 'https://opensource.facebook.com/legal/privacy/',
              target: '_blank',
              rel: 'noreferrer noopener',
            },
            {
              label: 'Terms',
              href: 'https://opensource.facebook.com/legal/terms/',
              target: '_blank',
              rel: 'noreferrer noopener',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Meta Platforms, Inc.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          path: '../docs',
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/facebookarchive/flux/edit/master/docs/',
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

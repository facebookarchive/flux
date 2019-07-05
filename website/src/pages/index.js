/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import classnames from 'classnames';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import withBaseUrl from '@docusaurus/withBaseUrl';
import styles from './styles.module.css';

const features = [
  {
    title: <>What is Flux?</>,
    imageUrl: 'img/undraw_building_blocks.svg',
    description: (
      <>
        Flux is the application architecture that Facebook uses for building
        client-side web applications.
      </>
    ),
  },
  {
    title: <>What does it do?</>,
    imageUrl: 'img/undraw_react.svg',
    description: (
      <>
        It complements React's composable view components by utilizing a
        unidirectional data flow.
      </>
    ),
  },
  {
    title: <>How do I use it?</>,
    imageUrl: 'img/undraw_programming.svg',
    description: (
      <>
        It's more of a pattern rather than a formal framework, and you can start
        using Flux immediately without a lot of new code.
      </>
    ),
  },
];

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;

  return (
    <Layout
      title={siteConfig.title}
      description={siteConfig.tagline}
    >
      <header className={classnames('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={classnames(
                'button button--secondary button--lg',
                styles.getStarted,
              )}
              to={withBaseUrl('docs/overview')}
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>
      <main>
        {features && features.length && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map(({ imageUrl, title, description }, idx) => (
                  <div
                    key={idx}
                    className={classnames('col col--4', styles.feature)}
                  >
                    {imageUrl && (
                      <div className="text--center">
                        <img
                          className={styles.featureImage}
                          src={withBaseUrl(imageUrl)}
                          alt={title}
                        />
                      </div>
                    )}
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
        <div className="container">
          <div className="row">
            <div className="col col--6 col--offset-3 padding-vert--lg">
              <h2>Introduction Video</h2>
              <iframe
                width="100%"
                height="315"
                src="https://www.youtube.com/embed/nYkdrAPrdcw"
                frameborder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              />
              <div className="text--center padding-vert--lg">
                <Link
                  className="button button--primary button--lg"
                  to={withBaseUrl('docs/overview')}
                >
                  Learn more about Flux!
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}

export default Home;

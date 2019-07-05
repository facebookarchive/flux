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

function Support() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <div className="container">
        <div className="row">
          <div className="col col--6 col--offset-3 padding-vert--lg">
            <h1>Need Help?</h1>
            <p>Flux is worked on full-time by Facebook's product infrastructure user interface engineering teams. They're often around and available for questions.</p>

            <h2>Stack Overflow</h2>
            <p>Many members of the community use Stack Overflow to ask questions. Read through the <a href="http://stackoverflow.com/questions/tagged/reactjs">existing questions</a> tagged with reactjs or <a href="http://stackoverflow.com/questions/ask">ask your own</a>!</p>

            <h2>Google Groups mailing list</h2>
            <p>The <a href="http://groups.google.com/group/reactjs">Reactjs Google Group</a> is also a good place to ask questions and find answers.</p>

            <h2>IRC</h2>
            <p>Many developers and users idle on Freenode.net's IRC network in <a href="irc://chat.freenode.net/reactjs">#reactjs on freenode</a>.</p>

            <h2>Twitter</h2>
            <p><a href="https://twitter.com/search?q=%23fluxjs">#fluxjs hash tag on Twitter</a> is used to keep up with the latest Flux news.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Support;

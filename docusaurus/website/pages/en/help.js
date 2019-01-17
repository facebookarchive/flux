/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');

const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

function Help(props) {
  const {config: siteConfig, language = ''} = props;
  const {baseUrl, docsUrl} = siteConfig;
  const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
  const langPart = `${language ? `${language}/` : ''}`;
  const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

  const supportLinks = [
    {
      content: `Many members of the community use Stack Overflow to ask questions. Read through the [existing questions](https://stackoverflow.com/questions/tagged/reactjs) tagged with reactjs or [ask your own!](https://stackoverflow.com/questions/ask)`,
      title: 'StackOverflow',
    },
    {
      content: '[The reactjs Google Group](https://groups.google.com/forum/#!forum/reactjs) is also a good place to ask questions and find answers.',
      title: 'Google Groups mailing list',
    },
    {
      content: 'Many developers and users idle on Freenode.net\'s IRC network in [#reactjs on freenode.](irc://chat.freenode.net/reactjs)',
      title: 'IRC',
    },
    {
      content: '[#fluxjs hash tag on Twitter](https://twitter.com/search?q=%23fluxjs) is used to keep up with the latest Flux news.',
      title: 'Twitter',
    }
  ];

  return (
    <div className="docMainWrapper wrapper">
      <Container className="mainContainer documentContainer postContainer">
        <div className="post">
          <header className="postHeader">
            <h1>Need help?</h1>
          </header>
          <p>Flux is worked on full-time by Facebook's product infrastructure user interface engineering teams. They're often around and available for questions.</p>
          <GridBlock contents={supportLinks} layout="twoColumn" />
        </div>
      </Container>
    </div>
  );
}

module.exports = Help;

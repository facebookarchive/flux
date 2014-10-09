/**
 * @jsx React.DOM
 */

var React = require('React');
var Site = require('Site');
var Prism = require('Prism');
var Marked = require('Marked');
var unindent = require('unindent');

var index = React.createClass({
  render: function() {
    return (
      <Site>
        <div className="hero">
          <div className="wrap">
            <div className="text"><strong>Flux</strong></div>
            <div className="minitext">
              Application Architecture for Building User Interfaces
            </div>
          </div>
        </div>

        <section className="content wrap">
          <section className="home-section home-getting-started">
            <p>
              Flux is the application architecture that Facebook uses for building client-side web applications.  It complements React's composable view components by utilizing a unidirectional data flow.  It's more of a pattern rather than a formal framework, and you can start using Flux immediately without a lot of new code.
            </p>
          </section>

          <section className="home-section home-getting-started">
            <iframe width="500" height="280" src="//www.youtube.com/embed/nYkdrAPrdcw?list=PLb0IAmt7-GS188xDYE-u1ShQmFFGbrk0v&amp;start=621" frameBorder="0" allowFullcreen></iframe>
          </section>

          <section className="home-bottom-section">
            <div className="buttons-unit">
              <a href="docs/overview.html#content" className="button">Learn more about Flux</a>
            </div>
          </section>
          <p></p>
        </section>
      </Site>
    );
  }
});

module.exports = index;

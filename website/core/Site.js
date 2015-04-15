/**
 * @providesModule Site
 * @jsx React.DOM
 */

var React = require('React');
var HeaderLinks = require('HeaderLinks');

var Site = React.createClass({
  render: function() {
    return (
      <html>
        <head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
          <title>Flux | Application Architecture for Building User Interfaces</title>
          <meta name="viewport" content="width=device-width" />
          <meta property="og:title" content="Flux | Application Architecture for Building User Interfaces" />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="http://facebook.github.io/flux/index.html" />
          <meta property="og:description" content="Application Architecture for Building User Interfaces" />

          <link rel="stylesheet" href="/flux/css/flux.css" />

          <script type="text/javascript" src="//use.typekit.net/vqa1hcx.js"></script>
          <script type="text/javascript">{'try{Typekit.load();}catch(e){}'}</script>
        </head>
        <body>

          <div className="container">
            <div className="nav-main">
              <div className="wrap">
                <a className="nav-home" href="/flux/">
                  <img className="nav-logo" src="/flux/img/flux_logo.svg" width="50" height="50" />
                  Flux
                </a>
                <HeaderLinks section={this.props.section} />
              </div>
            </div>

            {this.props.children}

            <footer className="wrap">
              <div className="right">© 2014-2015 Facebook Inc.</div>
            </footer>
          </div>

          <div id="fb-root" />
          <script dangerouslySetInnerHTML={{__html: `
            (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
            (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
            })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
            ga('create', 'UA-387204-10', 'facebook.github.io');
            ga('send', 'pageview');

            !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)
            ){js=d.createElement(s);js.id=id;js.src="https://platform.twitter.com/widgets.js";
            fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");
          `}} />
        </body>
      </html>
    );
  }
});

module.exports = Site;

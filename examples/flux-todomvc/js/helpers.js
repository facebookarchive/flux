function ToObject(val) {
  if (val == null) {
    throw new TypeError('Object.assign cannot be called with null or undefined');
  }

  return Object(val);
}

window.Object.assign = window.Object.assign || function (target, source) {
  var from;
  var keys;
  var to = ToObject(target);

  for (var s = 1; s < arguments.length; s++) {
    from = arguments[s];
    keys = Object.keys(Object(from));

    for (var i = 0; i < keys.length; i++) {
      to[keys[i]] = from[keys[i]];
    }
  }

  return to;
};

module.exports = {
  styles: function(styleString) {
    var rulesForCssText = function (styleContent) {
      var parser = new CSSParser();
      var sheet = parser.parse(styleContent, false, true);

      var rules = {};

      sheet.cssRules.forEach(function(rule) {
        var properties = {};

        if (rule.declarations) {
          rule.declarations.forEach(function(declaration) {
            properties[declaration.property] = declaration.valueText;
          });
        }

        rules[rule.mSelectorText] = properties;
      });

      return rules;
    };

    var tree;

    var parser = less.Parser();

    parser.parse(styleString, function(err, t) {
      if (err) {
        console.error(err);
      }

      tree = t;
    });

    var rules = {};

    rules.refresh = function() {
      rules.css = tree.toCSS();

      var r = rulesForCssText(rules.css);

      for (var rr in r) {
        if (!r.hasOwnProperty(rr)) {
          continue;
        }

        rules[rr] = r[rr];
      }
    };

    rules.refresh();

    return rules;
  }
};
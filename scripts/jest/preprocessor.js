var assign = require('object-assign');
var babel = require('babel-core');
var babelOpts = require('../babel/default-options');

module.exports = {
  process: function(src, path) {
    return babel.transform(src, assign({filename: path}, babelOpts)).code;
  }
};

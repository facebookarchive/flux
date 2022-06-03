const assign = require('object-assign');
const babel = require('@babel/core');
const babelOpts = require('../babel/default-options');

module.exports = {
  process: function (src, path) {
    return {
      code: babel.transform(src, assign({filename: path}, babelOpts)).code,
    };
  },
};

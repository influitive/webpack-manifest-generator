'use strict';
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

const forOwn = require('lodash/forOwn');

const reHotUpdate = /\.hot-update\.js$/;
const reSourceMap = /\.map$/;

function ManifestGeneratorPlugin(outputPath) {
  if (!outputPath) {
    throw new Error('outputPath is required');
  }
  this.outputPath = outputPath;
  this.outputData = {};
}

ManifestGeneratorPlugin.prototype.apply = function (compiler) {
  const outputPath = this.outputPath;

  const options = {
    source: false,
    modules: false
  };

  compiler.plugin('after-emit', (compilation, callback) => {
    const data = compilation.getStats().toJson(options);
    const assets = data.assetsByChunkName;
    const outputData = this.outputData;

    function set(item, key) {
      const ext = path.extname(item);
      outputData[key + ext] = item;
    }

    // { index: ['index.bundle.js', 'index.bundle.css', 'index.bundle.js.map', 'index.bundle.css.map'] }
    // client.e020f67dfe212e4ba38c.hot-update.js
    forOwn(assets, (value, key) => {
      if (Array.isArray(value)) {
        value
        .filter(item => !reHotUpdate.test(item))
        .filter(item => !reSourceMap.test(item))
        .forEach((item) => set(item, key));
      } else {
        set(value, key);
      }
    });

    this.outputData = outputData;

    mkdirp(path.dirname(outputPath), (err) => {
      if (err) {
        return callback(err);
      }

      const contents = JSON.stringify(outputData, null, 2);
      let original;
      try {
        original = fs.readFileSync(outputPath, { encoding: 'utf8' });
      } catch(err) {}
      if (original && original === contents) {
        return callback();
      }
      fs.writeFile(outputPath, contents, callback);
    });
  });
};

module.exports = ManifestGeneratorPlugin;

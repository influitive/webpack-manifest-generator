'use strict';
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

const forOwn = require('lodash/forOwn');

const extmap = '.map';

function ManifestGeneratorPlugin(outputPath) {
  if (!outputPath) {
    throw new Error('outputPath is required');
  }
  this.outputPath = outputPath;
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
    const outputData = {};

    function set(item, key) {
      let ext = path.extname(item);
      if (ext === extmap) {
        ext = path.extname(path.basename(item, ext)) + ext;
      }
      outputData[key + ext] = item;
    }

    // { index: ['index.bundle.js', 'index.bundle.css', 'index.bundle.js.map', 'index.bundle.css.map'] }
    forOwn(assets, (value, key) => {
      if (Array.isArray(value)) {
        value.forEach((item) => set(item, key));
      } else {
        set(value, key);
      }
    });

    mkdirp(path.dirname(outputPath), (err) => {
      if (err) {
        return callback(err);
      }
      fs.writeFile(outputPath, JSON.stringify(outputData, null, 2), callback);
    });
  });
};

module.exports = ManifestGeneratorPlugin;

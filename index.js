const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

const forOwn = require('lodash/forOwn');

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

  compiler.plugin('done', (stats) => {
    const data = stats.toJson(options);
    const assets = data.assetsByChunkName;
    const outputData = {};

    function set(item, key) {
      const ext = path.extname(item);
      const newKey = key + ext;
      if (outputData[newKey]) {
        const existsItem = outputData[newKey];
        delete outputData[newKey];
        set(existsItem, key + path.extname(path.basename(existsItem, ext)))
        set(item, key + path.extname(path.basename(item, ext)));
      } else {
        outputData[newKey] = item;
      }
    }

    // { index: ['index.bundle.js', 'index.bundle.css', 'index.bundle.js.map', 'index.bundle.css.map'] }
    forOwn(assets, (value, key) => {
      if (Array.isArray(value)) {
        value.forEach((item) => set(item, key));
      } else {
        set(value, key);
      }
    });

    mkdirp.sync(path.dirname(outputPath));
    fs.writeFileSync(outputPath, JSON.stringify(outputData));
  });
};

module.exports = ManifestGeneratorPlugin;

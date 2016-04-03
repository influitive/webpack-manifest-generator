var fs = require('fs');
var path = require('path');

var forOwn = require('lodash/forOwn');

var ManifestGeneratorPlugin = function (outputPath) {
  this.outputPath = outputPath;
};

ManifestGeneratorPlugin.prototype.apply = function (compiler) {
  var self = this;
  var outputPath = this.outputPath;

  // Micro optimize toJson by eliminating all of the data we do not need.
  var options = {
    source: false,
    modules: false
  };

  compiler.plugin('done', function (stats) {
    var data = stats.toJson(options);
    var assets = data.assetsByChunkName;
    var outputData = {};

    function set(item, key) {
      var ext = path.extname(item);
      var newKey = key + ext;
      if (outputData[newKey]) {
        var existsItem = outputData[newKey];
        delete outputData[newKey];
        set(existsItem, key + path.extname(path.basename(existsItem, ext)))
        set(item, key + path.extname(path.basename(item, ext)));
      } else {
        outputData[newKey] = item;
      }
    }

    // { index: ['index.bundle.js', 'index.bundle.css', 'index.bundle.js.map', 'index.bundle.css.map'] }
    forOwn(assets, function(value, key) {
      if (Array.isArray(value)) {
        value.forEach(function(item) { set(item, key) });
      } else {
        set(value, key);
      }
    });

    fs.writeFileSync(outputPath, JSON.stringify(outputData));
  });
};

module.exports = ManifestGeneratorPlugin;

var _ = require('lodash');
var fs = require('fs');

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
    var outputData = {};
    var assets = data.assetsByChunkName;

    _.forOwn(assets, function(value, key) {
      console.log(value);
      if (typeof value !== 'string') {
        // if value is not a string, assume its an array
        value = value[0];
      }
      var ext = value.match(/(\.\w*)$/)[1];
      var newKey = key + ext;

      outputData[newKey] = value;
    });

    fs.writeFileSync(outputPath, JSON.stringify(outputData));
  });
};

module.exports = ManifestGeneratorPlugin;

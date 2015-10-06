# Manifest Generator for Webpack

Webpack Plugin that generates a manifest of bundled files.

## Usage

```javascript
// webpack.config.js  
var ManifestGeneratorPlugin = require('manifest-generator-plugin');

var config = {
  ...
  entry: {
    "bundle": "./src/application.js",
    "vendors": "./vendors/vendors.js"
  },
  output: {
    path: './public/assets/',
    filename: 'js/[name]-[hash].js',
    publicPath: "http://example.com/assets"
  },
  plugins: {
    new ManifestGeneratorPlugin("PATH_TO_DEST_DIRECTORY")
  }
  ...
}

module.exports = config;
```

## Output

```json
{
  "bundle.js": "js/bundle-f34dc68a3493edfcaa3a.js",
  "vendors.js": "js/vendors-13adcef238710a91e834.js"
}
```

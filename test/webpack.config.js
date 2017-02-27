const WebpackBbqManifestGenerator = require('../');

const basedir = `${__dirname}`;
const fixtures = `${basedir}/fixtures`;

module.exports = {
  context: basedir,
  entry: {
    index: require.resolve(`${fixtures}/src/`),
  },
  module: {
    loaders: [{
      test: /\.js$/,
      include: `${fixtures}/src/`,
      loader: 'babel-loader',
      query: {
        presets: ['react', 'es2015'],
        plugins: ['add-module-exports'],
      },
    }],
  },
  plugins: [
    new WebpackBbqManifestGenerator(`${fixtures}/app-revisions.json`),
  ],
  output: {
    path: `${fixtures}/public/`,
  },
};

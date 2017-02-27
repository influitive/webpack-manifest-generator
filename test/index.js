const fs = require('fs');

const tape = require('tape');

const webpack = require('webpack');
const rimraf = require('rimraf');

const fixtures = `${__dirname}/fixtures`;

tape('manifest generator', (t) => {
  webpack(require('./webpack.config')).run((err, stats) => {
    t.ifError(err);
    fs.stat(`${fixtures}/app-revisions.json`, (err) => {
      t.ifError(err);
      const revisions = require(`${fixtures}/app-revisions.json`);
      t.equal(Object.keys(revisions).length, 1);
      t.end();

      rimraf.sync(`${fixtures}/app-revisions.json`);
      rimraf.sync(`${fixtures}/public`)
    });
  });
});

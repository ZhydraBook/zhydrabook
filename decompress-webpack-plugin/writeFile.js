import Promise from 'bluebird';
import loaderUtils from 'loader-utils';
import path from 'path';
import decompress from 'decompress';
import _ from 'lodash';

const fs = Promise.promisifyAll(require('fs')); // eslint-disable-line import/no-commonjs

export default function writeFile(globalRef, pattern, file) {
  const { info, debug, compilation, fileDependencies, written, copyUnmodified } = globalRef;

  return fs.statAsync(file.absoluteFrom)
    .then((stat) => {
      // We don't write empty directories
      if (stat.isDirectory()) {
        return;
      }

      info(`reading ${file.absoluteFrom} to write to assets`);
      return fs.readFileAsync(file.absoluteFrom)
        .then((content) => {

          var hash = loaderUtils.getHashDigest(content);

          if (!copyUnmodified &&
            written[file.absoluteFrom] && written[file.absoluteFrom][hash]) {
            info(`skipping '${file.webpackTo}', because it hasn't changed`);
            return;
          } else {
            debug(`added ${hash} to written tracking for '${file.absoluteFrom}'`);
            written[file.absoluteFrom] = {
              [hash]: true
            };
          }

          if (compilation.assets[file.webpackTo] && !file.force) {
            info(`skipping '${file.webpackTo}', because it already exists`);
            return;
          }

          info(`writing '${file.webpackTo}' to compilation assets from '${file.absoluteFrom}'`);
          decompress(file.absoluteFrom, file.webpackTo, {
            filter: file => {
              return file.path.indexOf("__MACOSX") < 0
            }
          }).then(files => {
            info("done!")
          });
        });
    });
}


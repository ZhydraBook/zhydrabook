import Promise from 'bluebird';
import path from 'path';
import _ from 'lodash';
import isGlob from 'is-glob';

const fs = Promise.promisifyAll(require('fs')); // eslint-disable-line import/no-commonjs

export default function preProcessPattern(globalRef, pattern) {
  const { info, debug, warning, context,
    fileDependencies, contextDependencies, compilation } = globalRef;

  pattern = _.cloneDeep(pattern);
  pattern.to = pattern.to || '';
  pattern.context = pattern.context || context;
  if (!path.isAbsolute(pattern.context)) {
    pattern.context = path.join(context, pattern.context);
  }
  pattern.ignore = globalRef.ignore.concat(pattern.ignore || []);

  info(`processing from: '${pattern.from}' to: '${pattern.to}'`);

  switch (true) {
    case !!pattern.toType: // if toType already exists
      break;
    case path.extname(pattern.to) === '' || pattern.to.slice(-1) === '/':
      pattern.toType = 'dir';
      break;
    default:
      pattern.toType = 'file';
  }

  debug(`determined '${pattern.to}' is a '${pattern.toType}'`);

  // If we know it's a glob, then bail early
  if (_.isObject(pattern.from) && pattern.from.glob) {
    pattern.fromType = 'glob';
    pattern.fromArgs = _.omit(pattern.from, ['glob']);
    pattern.absoluteFrom = path.resolve(pattern.context, pattern.from.glob);
    return Promise.resolve(pattern);
  }

  if (path.isAbsolute(pattern.from)) {
    pattern.absoluteFrom = pattern.from;
  } else {
    pattern.absoluteFrom = path.resolve(pattern.context, pattern.from);
  }

  debug(`determined '${pattern.from}' to be read from '${pattern.absoluteFrom}'`);

  return fs
    .statAsync(pattern.absoluteFrom)
    .catch(() => {
      // If from doesn't appear to be a glob, then log a warning
      if (isGlob(pattern.from) || pattern.from.indexOf('*') !== -1) {
        pattern.fromType = 'glob';
      } else {
        const msg = `unable to locate '${pattern.from}' at '${pattern.absoluteFrom}'`;
        warning(msg);
        compilation.errors.push(`[decompress-webpack-plugin] ${msg}`);
        pattern.fromType = 'nonexistent';
      }
    })
    .then((stat) => {
      if (!stat) {
        return pattern;
      }

      if (stat.isDirectory()) {
        pattern.fromType = 'dir';
        pattern.context = pattern.absoluteFrom;
        contextDependencies.push(pattern.absoluteFrom);
        pattern.absoluteFrom = path.join(pattern.absoluteFrom, '**/*');
        pattern.fromArgs = {
          dot: true
        };
      } else if (stat.isFile()) {
        pattern.fromType = 'file';
        pattern.context = path.dirname(pattern.absoluteFrom);
        pattern.fromArgs = {
          dot: true
        };
        fileDependencies.push(pattern.absoluteFrom);
      } else if (!pattern.fromType) {
        info(`Unrecognized file type for ${pattern.from}`);
      }
      return pattern;
    });
}

/**
 * Provides js utils and helpers.
 * Extends Array|Object prototypes.
 *
 * @file utils.js
 * @module lib/utils.js
 * @author Eric Lavault {@link https://github.com/lvlte}
 * @license MIT
 */

/**
 * Defines assignRange() prototype.
 *
 * Assigns a range of numbers to an array|object, with each resulting number n
 * being assigned to its corresponding nth index, thus combining keys & values :
 * [start, start + step, start + 2 * step, ...].
 *
 * @param {number} start
 *  Starting number of the sequence.
 *
 * @param {number} [stop]
 *  Generate numbers up to, but not including this number.
 *
 * @param {number} [step=1]
 *  Difference between each number in the sequence.
 *
 * @return {(array|Object)}
 */
const _assignRangeProto = {
  enumerable: false,
  configurable: false,
  writable: false,
  value: function(start, stop, step=1) {
    start = start || 0;
    if (arguments.length == 1) {
      stop = start;
      start = 0;
    }
    if (start >= stop)
      return this;
    let j = start;
    do this[j] = j;
    while ((j+=step) < stop);
    return this;
  }
};

Object.defineProperty(Array.prototype, 'assignRange', _assignRangeProto);
Object.defineProperty(Object.prototype, 'assignRange', _assignRangeProto);

/**
 * Defines swap() prototype.
 *
 * Swaps elements x and y in the given array|object.
 *
 * @param {number} x
 * @param {number} y
 * @return {(array|Object)}
 */
const _swapProto = {
  enumerable: false,
  configurable: false,
  writable: false,
  value: function(x, y) {
    [this[x], this[y]] = [this[y], this[x]];
    return this;
  }
};

Object.defineProperty(Array.prototype, 'swap', _swapProto);
Object.defineProperty(Object.prototype, 'swap', _swapProto);

/**
 * Defines Object.head() prototype.
 *
 * Returns an object containing the n first elements of this object, iterating
 * over its keys.
 *
 * @param {number} n
 * @return {Object}
 */
const _headObjectProto = {
  enumerable: false,
  configurable: false,
  writable: false,
  value: function (n=10) {
    let o = {};
    let i = 0;
    if (n < 0)
      return this.tail(n);
    for (let p in this) {
      o[p] = this[p];
      if (++i === n)
        break;
    }
    return o;
  }
}

/**
 * Defines Object.tail() prototype.
 *
 * Returns an object containing the n last elements of this object, iterating
 * over its keys.
 *
 * @param {number} n
 * @return {Object}
 */
const _tailObjectProto = {
  enumerable: false,
  configurable: false,
  writable: false,
  value: function (n=10) {
    let o = {};
    const keys = Object.keys(this).slice(-Math.abs(n));
    for (let k=0; k<keys.length; k++) {
      o[keys[k]] = this[keys[k]];
    }
    return o;
  }
}

// head & tail are reserved.
Object.defineProperty(Object.prototype, '_head', _headObjectProto);
Object.defineProperty(Object.prototype, '_tail', _tailObjectProto);


let Utils;
module.exports = Utils = {

  /**
   * Pre calculate the max call stack size (hard limit for recursive functions).
   */
  maxCallStackSize : (function() {
    const f = function() {
      try {
        return 1 + f();
      }
      catch (e) {
        return 1;
      }
    };
    return f();
  })(),

  /**
   * Returns a sequence of numbers starting from start (included, 0 by default),
   * and up to (excluding) stop, incrementing by the given step (1 by default).
   *
   * If stop and step are omitted, then the first argument is assumed to be stop
   * and start is assumed to be zero.
   *
   * @param {(number|bigint)} start
   * @param {(number|bigint)} stop
   * @param {(number|bigint)} step
   * @returns {array}
   */
  range(start, stop=start, step=1) {
    if (arguments.length === 1)
      start = typeof stop === 'bigint' ? 0n : 0;
    step = typeof start === 'bigint' ? BigInt(step) : step;
    let arr = [], j = start-step;
    while ((j+=step) < stop)
      arr.push(j);
    return arr;
  },

  /**
   * Loads and return the content of a file from the resource dir given its
   * filename.
   *
   * @param {string} filename
   * @returns {string}
   */
  load(filename) {
    const { readFileSync } = require('fs');
    const { resolve } = require('path');
    const fpath = resolve(__dirname, '../res/' + filename);
    return readFileSync(fpath, {encoding:'utf8', flag:'r'});
  }

}

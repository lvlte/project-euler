/**
 * Provides js utils and helpers.
 * Extends Array|Object|String|Number prototypes.
 *
 * @file utils.js
 * @module lib/utils.js
 * @author Eric Lavault {@link https://github.com/lvlte}
 * @license MIT
 */

/**
 * Defines Object.__proto__.assignRange()
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
    if (start >= stop && step > 0)
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
 * Defines [].__proto__.swap()
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
 * Defines Object.__proto__._head()
 *
 * Returns an object containing the n first elements of this object, iterating
 * over its keys.
 *
 * @param {number} n
 * @return {Object}
 */
Object.defineProperty(Object.prototype, '_head', {
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
});

/**
 * Defines Object.__proto__._tail()
 *
 * Returns an object containing the n last elements of this object, iterating
 * over its keys.
 *
 * @param {number} n
 * @return {Object}
 */
Object.defineProperty(Object.prototype, '_tail', {
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
});

/**
 * Defines [].__proto__.rotate()
 *
 * Rotates the given array in-place by moving the first element to the end of
 * the array, or the contrary if `dir` is negative.
 *
 * @param {number} [dir=0]
 * @return {array}
 */
Object.defineProperty(Array.prototype, 'rotate', {
  enumerable: false,
  configurable: false,
  writable: false,
  value: function(dir=0) {
    if (dir < 0) {
      const a = this.pop();
      this.unshift(a);
    }
    else {
      const a = this.shift();
      this.push(a);
    }
    return this;
  }
});

/**
 * Defines Number.__proto__.toBinary()
 *
 * @return {string}
 */
Object.defineProperty(Number.prototype, 'toBinary', {
  enumerable: false,
  configurable: false,
  writable: false,
  value: function() {
    return this.toString(2);
  }
});

/**
 * Defines String.__proto__.fromBinary()
 *
 * @return {number}
 */
Object.defineProperty(String.prototype, 'fromBinary', {
  enumerable: false,
  configurable: false,
  writable: false,
  value: function() {
    return parseInt(this, 2);
  }
});

/**
 * Defines Array.__proto__.last()
 *
 * @return {*}
 */
Object.defineProperty(Array.prototype, 'last', {
  enumerable: false,
  configurable: false,
  writable: false,
  value: function() {
    return this.length && this[this.length-1] || undefined;
  }
});

/**
 * Defines Array.__proto__.fillS()
 *
 * Fills an array with static values by repeating the given sequence.
 *
 * @return {*}
 */
Object.defineProperty(Array.prototype, 'fillS', {
  enumerable: false,
  configurable: false,
  writable: false,
  value: function(sequence) {
    if (!Array.isArray(sequence) || !sequence.length)
      return this;
    if (sequence.length === 1)
      return this.fill(sequence[0]);
    const k = sequence.length;
    for (let i=0; i<this.length; i++) {
      this[i] = sequence[i%k];
    }
    return this;
  }
});

/**
 * Defines Array.__proto__.occurrences() / String.__proto__.occurrences()
 *
 * Counts occurrences of distinct elements in an array. Returns an object with
 * the array elements (scalar values) as keys and their respective number of
 * occurrences in the array as values.
 *
 * Accepts filters as an array, or as a scalar in which case it will return only
 * the count for that value as a number.
 *
 * @return {Object|number}
 */
const _occurrencesProto = {
  enumerable: false,
  configurable: false,
  writable: false,
  value: function() {
    let occurrences = {};
    let total = this.length;
    for (let i=0; i<this.length; i++) {
      const num = this[i];
      occurrences[num] = num in occurrences ? occurrences[num] + 1 : 1;
    }
    const filter = arguments.length === 1 ? arguments[0] : [...arguments];
    if (!Array.isArray(filter))
      return occurrences[filter] || 0;
    else if (filter.length) {
      let o = {};
      total = 0;
      for (let i=0; i<filter.length; i++) {
        o[filter[i]] = occurrences[filter[i]] || 0;
        total += o[filter[i]];
      }
      occurrences = o;
    }
    Object.defineProperty(occurrences, 'total', { value: total });
    return occurrences;
  }
};

Object.defineProperty(Array.prototype, 'occurrences', _occurrencesProto);
Object.defineProperty(String.prototype, 'occurrences', _occurrencesProto);

/**
 * Defines Array.__proto__.mapToObj()
 *
 * Same as [].map() but outputs an object instead.
 */
Object.defineProperty(Array.prototype, 'mapToObj', {
  enumerable: false,
  configurable: false,
  writable: false,
  value: function(fn) {
    if (fn && typeof fn !== 'function')
      throw `${fn} is not a function`;
    let o = {};
    if (fn) {
      for (let i=0; i<this.length; i++) {
        const [k, v] = fn.call(this, this[i], i, o);
        o[k] = v;
      }
    }
    else
      for (let i=0; i<this.length; i++)
        o[this[i]] = this[i];
    return o;
  }
});

/**
 * Defines Object.__proto__.map()
 *
 * Same as [].map() but for an object, using `for ... in` to iterate over it.
 */
Object.defineProperty(Object.prototype, 'map', {
  enumerable: false,
  configurable: false,
  writable: false,
  value: function(fn) {
    if (typeof fn !== 'function')
      throw `${fn} is not a function`;
    let o = {};
    let i = 0;
    for (const p in this) {
      const [k, v] = fn.call(this, p, this[p], i++, o);
      o[k] = v;
    }
    return o;
  }
});

/**
 * Defines Object.__proto__.mapToArr()
 *
 * Same as [].map() but for an object, using `for ... in` to iterate over it.
 */
Object.defineProperty(Object.prototype, 'mapToArr', {
  enumerable: false,
  configurable: false,
  writable: false,
  value: function(fn) {
    if (typeof fn !== 'function')
      throw `${fn} is not a function`;
    let arr = [];
    let i = 0;
    for (const p in this)
      arr[i] = fn.call(this, p, this[p], i++, arr);
    return arr;
  }
});

/**
 * Defines Object.__proto__.filter()
 *
 * Same as [].filter() but for an object, using `for ... in` to iterate over it.
 */
Object.defineProperty(Object.prototype, 'filter', {
  enumerable: false,
  configurable: false,
  writable: false,
  value: function(fn) {
    if (typeof fn !== 'function')
      throw `${fn} is not a function`;
    let o = {};
    let i = 0;
    for (const p in this) {
      if (fn.call(this, p, this[p], i++, o))
        o[p] = this[p];
    }
    return o;
  }
});

/**
 * Defines [].__proto__.maxConsecutive() / String.__proto__.maxConsecutive()
 *
 * Counts the number of maximum consecutive values contained in an array|string.
 * Return an object mapping values to their number of consecutive occurences.
 *
 * @return {Object}
 */
const _maxConsecutiveProto = {
  enumerable: false,
  configurable: false,
  writable: false,
  value: function() {
    let conseq = {};
    if (this.length === 0)
      return conseq;
    if (this.length === 1) {
      conseq[this[0]] = 1;
      return conseq;
    }
    let counter = {[this[0]]: 1};
    for (let i=1; i<this.length; i++) {
      const prev = this[i-1];
      if (this[i] === prev) {
        counter[prev]++;
      }
      else {
        counter[this[i]] = 1;
        conseq[prev] = Math.max(counter[prev], conseq[prev] || 0);
        counter[prev] = 0;
      }
    }
    const last = this[this.length-1];
    conseq[last] = Math.max(counter[last], conseq[last] || 0);
    return conseq;
  }
};

Object.defineProperty(Array.prototype, 'maxConsecutive', _maxConsecutiveProto);
Object.defineProperty(String.prototype, 'maxConsecutive', _maxConsecutiveProto);

// Defines the maximum array length supported
Array.MAX_LENGTH = 2**32-1;
Array.MAX_INT_RANGE = 134_217_725;

module.exports = {

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
    if (typeof start === 'bigint')
      step = BigInt(step);
    const len = Math.floor(Number((stop-start)/step));
    if (len > Array.MAX_INT_RANGE)
      throw RangeError(`The maximum range supported is of length ${Array.MAX_INT_RANGE}`);
    if (len < 0)
      return [];
    let arr = Array(len);
    let i = 0, j = start;
    if (step > 0) {
      do arr[i++] = j;
      while ((j+=step) < stop);
    }
    else {
      do arr[i++] = j;
      while ((j+=step) > stop);
    }
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
  },

  /**
   * Function memoizer. Given some function, cache its results by mapping the
   * function's 1st argument to the corresponding return value.
   *
   * Nb. If the passed-in function expects more than one argument, they will be
   * passed along, but the cached results will still be indexed regarding the
   * value of the first parameter only.
   *
   * @param {function} func A callable function
   * @param {number} [maxSize=10000] The cache max size, defaults to 10000
   * @returns {function} - The memoized function
   */
  memoize(func, maxSize=10000) {
    return (function() {
      let cache = {};
      let left = maxSize;
      function memoized(n, ...args) {
        if (n in cache)
          return cache[n];
        else if (left-->0)
          return cache[n] = func(n, ...args);
        return func(n, ...args);
      }
      return memoized;
    }());
  },

  /**
   * Returns the given number n as an array of digits. If `cast` is false, each
   * digit is a string instead of a number.
   *
   * @param {number} n
   * @param {boolean} [cast=true]
   * @returns {array}
   */
  digits(n, cast=true) {
    return cast && (''+n).split('').map(d => +d) || (''+n).split('');
  },

  /**
   * Returns whether or not the given string is palindromic.
   *
   * @param {string} str
   * @returns {boolean}
   */
  isPalindromic (str) {
    const len = str.length;
    for (let i=0; i<len; i++) {
      if (str[i] != str[len-1-i])
        return false;
    }
    return true;
  }

}

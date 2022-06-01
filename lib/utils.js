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
 * Defines Number.__proto__.isEven()
 *
 * @return {boolean}
 */
Object.defineProperty(Number.prototype, 'isEven', {
  enumerable: false,
  configurable: false,
  writable: false,
  value: function() {
    return (this & 1) == 0;
  }
});

/**
 * Defines Number.__proto__.isOdd()
 *
 * @return {boolean}
 */
Object.defineProperty(Number.prototype, 'isOdd', {
  enumerable: false,
  configurable: false,
  writable: false,
  value: function() {
    return (this & 1) == 1;
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
 * Defines BigInt.__proto__.isEven()
 *
 * @return {boolean}
 */
Object.defineProperty(BigInt.prototype, 'isEven', {
  enumerable: false,
  configurable: false,
  writable: false,
  value: function() {
    return (this & 1n) == 0n;
  }
});

/**
 * Defines BigInt.__proto__.isOdd()
 *
 * @return {boolean}
 */
Object.defineProperty(BigInt.prototype, 'isOdd', {
  enumerable: false,
  configurable: false,
  writable: false,
  value: function() {
    return (this & 1n) == 1n;
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
    return this.length > 0 ? this[this.length-1] : undefined;
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

let utils;
module.exports = utils = {

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
   * Generates a sequence of numbers starting from `start` (included), and up to
   * (but excluding) stop, incrementing by the given step.
   *
   * @param {(number|bigint)} start
   * @param {(number|bigint)} stop
   * @param {(number|bigint)} step
   * @yields {(number|bigint)}
   */
  * rangeGen(start, stop, step) {
    let x = start;
    if (step > 0 && x < stop) {
      do yield x;
      while ((x+=step) < stop);
    }
    else if (step < 0 && x > stop) {
      do yield x;
      while ((x+=step) > stop);
    }
  },

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
    const len = Math.ceil(Number((stop-start)/step));
    if (len <= 0)
      return [];
    const arr = Array(len);
    let i = 0;
    let x = start;
    if (step > 0 && x < stop) {
      do arr[i++] = x;
      while ((x+=step) < stop);
    }
    else if (step < 0 && x > stop) {
      do arr[i++] = x;
      while ((x+=step) > stop);
    }
    return arr;
  },

  /**
   * Loads and return the content of a file from the resource dir given its
   * filename.
   *
   * If `splitline` is true (default), returns an array after splitting the
   * content using (line feed | carriage return) as a delimiter, and filtering
   * empty lines.
   *
   * @param {string} filename
   * @param {boolean} [splitline=true]
   * @returns {(string|array)}
   */
  load(filename, splitline=true) {
    const { readFileSync } = require('fs');
    const { resolve } = require('path');
    const fpath = resolve(__dirname, '../res/' + filename);
    let data = readFileSync(fpath, {encoding:'utf8', flag:'r'});
    if (splitline)
      data = data.split(/\r?\n/).filter(line => line);
    return data;
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
  memoize(func, cache=new Map(), maxSize=10000) {
    return (function() {
      let left = maxSize;
      function memoized(n, ...args) {
        if (!cache.has(n)) {
          if (left-- > 0) cache.set(n, func(n, ...args));
          else return func(n, ...args);
        }
        return cache.get(n);
      }
      return memoized;
    }());
  },

  /**
   * Returns the given number `n` as an array of digits.
   *
   * Expects a positive integer represented either as a number, a bigint, or a
   * string (with a string, leading zeros are preserved, if any).
   *
   * Nb. This function is intended to be fast, it does not support exponential
   * notation (eg. 1.2e+21) and does not check for type/NaN/sign/decimals.
   *
   * If `asNumber` is false, each digit is returned as a string instead of a
   * number (ie. for use with string representation of base-10+ numbers, or for
   * preserving the fractional part and decimal point of decimal numbers, which
   * the function is not supposed to handle).
   *
   * @param {(number|bigint|string)} n
   * @param {boolean} [asNumber=true]
   * @returns {array}
   */
  digits(n, asNumber=true) {
    // [...''+n] is faster than (''+n).split('').
    // [...''+n].map(fn) is faster than Array.from(''+n, fn)
    // d => d.charCodeAt(0)-48 is faster than d => +d.

    if (!asNumber)
      return [...''+n];

    const T = typeof n;
    const m = {'number': Number.MAX_SAFE_INTEGER, 'bigint': 999_999_999}[T];

    // Remainder method is faster than spread+map for number|bigint less than or
    // equal to m (except for those having less than 4 digits).
    if (T === 'string' || n < 1000 || n > m)
      return [...''+n].map(d => d.charCodeAt(0)-48);

    n = Number(n);
    let k = Math.floor(Math.log10(n)) + 1;
    const D = Array(k);

    const divRem = (n, d, r=n%d) => [(n-r)/d, r];

    do [n, D[--k]] = divRem(n, 10);
    while (k > 0);

    return D;
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
  },

  /**
   * Returns the difference of A - B, that is, elements from A that are not
   * present in B, maintaing order.
   *
   * @param {array} A
   * @param {array} B
   * @returns
   */
  diff(A, B) {
    B = new Set(B);
    return A.filter(x => !B.has(x));
  },

  /**
   * Returns the intersection of the sets A and B, that is, elements that are
   * present in both collection.
   *
   * The function does not necessarilly maintains order and multiplicity of A,
   * unless specified by setting `preserve_order` to true.
   *
   * @param {array} A
   * @param {array} B
   * @returns {array}
   */
  intersect(A, B, preserve_order=false) {
    if (!preserve_order && A.length > B.length) {
      A = new Set(A);
      return B.filter(x => A.has(x));
    }
    B = new Set(B);
    return A.filter(x => B.has(x));
  },

  /**
   * Returns whether or not the given object is a scalar.
   *
   * @param {*} obj
   * @returns {boolean}
   */
  isScalar(obj) {
    return (/string|number|bigint|boolean/).test(typeof obj)
  },

  /**
   * Counts occurrences of distinct elements in an iterable.
   *
   * Accepts `filter` either as an iterable, a scalar (in which case it returns
   * only the count for that value) or a function callback (which receives two
   * argument for each distinct element: the element itself and the actual count
   * for that element).
   *
   * Returns an object with the elements (scalar values) as keys and their
   * respective number of occurrences along with the _total, or as a number if
   * `filter` is a scalar.
   *
   * @param {Iterable<*>} elements
   * @param {*} filter
   * @returns {(Object|number)}
   */
  count(elements, filter) {
    let Count = {};
    let total = [...elements].length;
    for (const el of elements)
      Count[el] = (Count[el] ?? 0) + 1;
    if (filter != undefined) {
      if (utils.isScalar(filter))
        return Count[filter] ?? 0;
      let o = {};
      total = 0;
      if (typeof filter === 'function') {
        for (const el in Count) {
          if (filter(el, Count[el])) {
            o[el] = Count[el];
            total += o[el];
          }
        }
      }
      else {
        for (const f of filter) {
          o[f] = Count[f] ?? 0;
          total += o[f];
        }
      }
      Count = o;
    }
    Object.defineProperty(Count, '_total', { value: total });
    return Count;
  },

  /**
   * Returns the type of the given object in UpperCamelCase.
   */
  type(obj) {
    return Object.prototype.toString.call(obj).slice(8,-1);
  }

}

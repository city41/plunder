var Util, buildIsType, type, _i, _isInteger, _len, _ref,
  __hasProp = {}.hasOwnProperty;

_isInteger = function(num) {
  return num === (num | 0);
};

Util = {
  rand: function(minOrMax, maxOrUndefined, dontFloor) {
    var max, min, range, result, shouldFloor;
    if (dontFloor == null) {
      dontFloor = false;
    }
    shouldFloor = !dontFloor;
    min = Util.isNumber(maxOrUndefined) ? minOrMax : 0;
    max = Util.isNumber(maxOrUndefined) ? maxOrUndefined : minOrMax;
    range = max - min;
    result = Math.random() * range + min;
    if (_isInteger(min) && _isInteger(max) && shouldFloor) {
      return Math.floor(result);
    } else {
      return result;
    }
  },
  coin: function() {
    return this.rand(0, 2) === 0;
  },
  degreesToRadians: function(degrees) {
    return degrees * Math.PI / 180;
  },
  radiansToDegrees: function(radians) {
    return radians * 180 / Math.PI;
  },
  isUndefined: function(o) {
    return typeof o === 'undefined';
  },
  isPrimitive: function(o) {
    return o === true || o === false || this.isString(o) || this.isNumber(o);
  },
  areSameTypes: function(a, b) {
    if (this.isArray(a)) {
      return this.isArray(b);
    }
    if (this.isArray(b)) {
      return false;
    }
    return typeof a === typeof b;
  },
  extend: function(target, incoming) {
    var key, value;
    if (target != null) {
      for (key in incoming) {
        if (!__hasProp.call(incoming, key)) continue;
        value = incoming[key];
        target[key] = value;
      }
    }
    return target;
  },
  clone: function(obj) {
    if (!obj || this.isPrimitive(obj)) {
      return obj;
    }
    if (this.isArray(obj)) {
      return obj.slice(0);
    }
    return this.extend({}, obj);
  },
  toArray: function(obj) {
    if (obj == null) {
      return [];
    }
    if (this.isArray(obj)) {
      return obj;
    } else {
      return [obj];
    }
  },
  last: function(array) {
    return array && array[array.length - 1];
  },
  first: function(array) {
    return array && array[0];
  },
  isEmpty: function(array) {
    return array && array.length === 0;
  },
  any: function(array) {
    return array && array.length > 0;
  }
};

Util.isArray = Array.isArray || function(obj) {
  return Object.prototype.toString.call(obj) === "[object Array]";
};

buildIsType = function(type) {
  return function(obj) {
    return Object.prototype.toString.call(obj) === ("[object " + type + "]");
  };
};

_ref = ['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'];
for (_i = 0, _len = _ref.length; _i < _len; _i++) {
  type = _ref[_i];
  Util["is" + type] = buildIsType(type);
}

module.exports = Util;

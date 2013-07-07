define("Timeline", ["Util", "Bezier", "Tween", "Wait", "Repeat", "Together", "Invoke"], function(U, Bezier, Tween, Wait, Repeat, Together, Invoke) {
  var Timeline;
  return Timeline = (function() {
    function Timeline(owner) {
      this.owner = owner;
      if (!this.owner) {
        throw new Error("Timeline requires an owner");
      }
      this._buildStack = [];
      this._childConfigStack = [];
    }

    Timeline.prototype._getTargets = function(targetOptions) {
      var targets, _ref, _ref1;
      targets = (_ref = (_ref1 = targetOptions.targets) != null ? _ref1 : targetOptions.target) != null ? _ref : this.owner;
      return U.toArray(targets);
    };

    Timeline.prototype._mergeConfig = function(config) {
      if (U.any(this._childConfigStack)) {
        return U.extend(U.clone(U.last(this._childConfigStack)), config);
      } else {
        return config;
      }
    };

    Timeline.prototype._addParentAnimation = function(childConfigOrBuilder, builderOrUndefined, AniConstructor, consArg) {
      var builder, childConfig, parentAni;
      if (U.isFunction(childConfigOrBuilder)) {
        builder = childConfigOrBuilder;
      } else {
        childConfig = childConfigOrBuilder;
        builder = builderOrUndefined;
      }
      parentAni = new AniConstructor(consArg);
      if (childConfig) {
        this._childConfigStack.push(childConfig);
      }
      this._buildStack.push(parentAni);
      builder(this);
      this._buildStack.pop();
      if (childConfig) {
        this._childConfigStack.pop();
      }
      return this._pushAnimation(parentAni);
    };

    Timeline.prototype._addAnimation = function(AniConstructor, config) {
      var ani;
      ani = new AniConstructor(this._mergeConfig(config));
      ani.targets = this._getTargets(ani);
      return this._pushAnimation(ani);
    };

    Timeline.prototype._pushAnimation = function(ani) {
      if (this._buildStack.length === 0) {
        this.owner.addAni(ani);
      } else {
        this._buildStack[this._buildStack.length - 1].children.push(ani);
      }
      return ani;
    };

    Timeline.prototype._fade = function(config, from, to) {
      if (U.isNumber(config)) {
        config = {
          duration: config
        };
      }
      config.property = "alpha";
      config.from = from;
      config.to = to;
      return this._addAnimation(Tween, config);
    };

    Timeline.prototype.reverse = function(ani) {
      return this._pushAnimation(ani.reverse());
    };

    Timeline.prototype.setProperty = function(config) {
      if (config == null) {
        config = {};
      }
      config.duration = 0;
      config.from = config.to = config.value;
      return this.tween(config);
    };

    Timeline.prototype.bezier = function(config) {
      if (config == null) {
        config = {};
      }
      return this._addAnimation(Bezier, config);
    };

    Timeline.prototype.tween = function(config) {
      if (config == null) {
        config = {};
      }
      return this._addAnimation(Tween, config);
    };

    Timeline.prototype.fadeIn = function(config) {
      if (config == null) {
        config = {};
      }
      return this._fade(config, 0, 1);
    };

    Timeline.prototype.fadeOut = function(config) {
      if (config == null) {
        config = {};
      }
      return this._fade(config, 1, 0);
    };

    Timeline.prototype.scale = function(config) {
      if (config == null) {
        config = {};
      }
      config.property = 'scale';
      return this.tween(config);
    };

    Timeline.prototype.color = function(config) {
      if (config == null) {
        config = {};
      }
      config.property = 'color';
      return this.tween(config);
    };

    Timeline.prototype.rotate = function(config) {
      if (config == null) {
        config = {};
      }
      config.property = 'angle';
      return this.tween(config);
    };

    Timeline.prototype.move = function(config) {
      var xconfig, yconfig, _ref, _ref1;
      xconfig = U.clone(config);
      xconfig.easing = (_ref = config.easingX) != null ? _ref : config.easing;
      xconfig.from = config.from.x;
      xconfig.to = config.to.x;
      xconfig.property = 'x';
      yconfig = U.clone(config);
      yconfig.easing = (_ref1 = config.easingY) != null ? _ref1 : config.easing;
      yconfig.from = config.from.y;
      yconfig.to = config.to.y;
      yconfig.property = 'y';
      return this.together(function(tl) {
        tl.tween(xconfig);
        return tl.tween(yconfig);
      });
    };

    Timeline.prototype.together = function(childConfigOrBuilder, builderOrUndefined) {
      return this._addParentAnimation(childConfigOrBuilder, builderOrUndefined, Together);
    };

    Timeline.prototype.sequence = function(childConfigOrBuilder, builderOrUndefined) {
      return this.repeat(1, childConfigOrBuilder, builderOrUndefined);
    };

    Timeline.prototype.forever = function(childConfigOrBuilder, builderOrUndefined) {
      return this.repeat(Infinity, childConfigOrBuilder, builderOrUndefined);
    };

    Timeline.prototype.repeat = function(count, childConfigOrBuilder, builderOrUndefined) {
      return this._addParentAnimation(childConfigOrBuilder, builderOrUndefined, Repeat, count);
    };

    Timeline.prototype.wait = function(duration) {
      return this.waitBetween(duration, duration);
    };

    Timeline.prototype.waitBetween = function(min, max) {
      return this._addAnimation(Wait, {
        min: min,
        max: max
      });
    };

    Timeline.prototype.invoke = function(func, context) {
      return this._addAnimation(Invoke, {
        func: func,
        context: context
      });
    };

    Timeline.prototype.stop = function() {
      return this.owner.clearAnis();
    };

    return Timeline;

  })();
});

var __hasProp = {}.hasOwnProperty;

define('Util', function() {
  var Util, _isInteger;
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
    isNumber: function(n) {
      return typeof n === "number";
    },
    isUndefined: function(obj) {
      return typeof obj === "undefined";
    },
    isFunction: function(f) {
      return typeof f === "function";
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
    return toString.call(obj) === "[object Array]";
  };
  return Util;
});

define('Bezier', ['Util'], function(U) {
  var Bezier;
  return Bezier = (function() {
    function Bezier(config) {
      U.extend(this, config);
      this.reset();
    }

    Bezier.prototype.reset = function() {
      this._elapsed = 0;
      this.done = this._elapsed >= this.duration;
      return this._targetsInitted = false;
    };

    Bezier.prototype.reverse = function() {
      return new Bezier({
        targets: this.targets,
        points: this._reversePoints(this.points),
        duration: this.duration
      });
    };

    Bezier.prototype._reversePoints = function(points) {
      points = U.clone(points);
      this._swap(points, 0, 3);
      this._swap(points, 1, 2);
      return points;
    };

    Bezier.prototype._swap = function(array, a, b) {
      var temp;
      temp = array[a];
      array[a] = array[b];
      return array[b] = temp;
    };

    Bezier.prototype._initTargets = function() {
      var target, _i, _len, _ref;
      _ref = this.targets;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        target = _ref[_i];
        target.x = this.points[0].x;
        target.y = this.points[0].y;
      }
      return this._targetsInitted = true;
    };

    Bezier.prototype.update = function(delta) {
      var target, _i, _len, _ref, _results;
      if (this.done || this.disabled) {
        return;
      }
      if (!this._targetsInitted) {
        this._initTargets();
      }
      this._elapsed += delta;
      if (this._elapsed > this.duration) {
        this._elapsed = this.duration;
        return this.done = true;
      } else {
        _ref = this.targets;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          target = _ref[_i];
          _results.push(this._move(target));
        }
        return _results;
      }
    };

    Bezier.prototype._move = function(target) {
      var percent, x, y, _ref;
      percent = this._elapsed / this.duration;
      _ref = this._computeBezier(0, percent), x = _ref.x, y = _ref.y;
      target.x = x;
      return target.y = y;
    };

    Bezier.prototype._computeBezier = function(index, time) {
      var oneMinusT, oneMinusTCubed, p1, p2, p3, p4, t, tCubed, x, x1, x2, x3, x4, y, y1, y2, y3, y4;
      t = time;
      p1 = this.points[index];
      p2 = this.points[index + 1];
      p3 = this.points[index + 2];
      p4 = this.points[index + 3];
      oneMinusT = 1 - t;
      oneMinusTCubed = oneMinusT * oneMinusT * oneMinusT;
      tCubed = t * t * t;
      x1 = oneMinusTCubed * p1.x;
      x2 = 3 * t * oneMinusT * oneMinusT * p2.x;
      x3 = 3 * t * t * oneMinusT * p3.x;
      x4 = tCubed * p4.x;
      x = x1 + x2 + x3 + x4;
      y1 = oneMinusTCubed * p1.y;
      y2 = 3 * t * oneMinusT * oneMinusT * p2.y;
      y3 = 3 * t * t * oneMinusT * p3.y;
      y4 = tCubed * p4.y;
      y = y1 + y2 + y3 + y4;
      return {
        x: x,
        y: y
      };
    };

    return Bezier;

  })();
});

define('Easing', function() {
  var Easing;
  return Easing = {
    linearTween: function(t, b, c, d) {
      return c * t / d + b;
    },
    easeInQuad: function(t, b, c, d) {
      return c * (t /= d) * t + b;
    },
    easeOutQuad: function(t, b, c, d) {
      return -c * (t /= d) * (t - 2) + b;
    },
    easeInOutQuad: function(t, b, c, d) {
      if ((t /= d / 2) < 1) {
        return c / 2 * t * t + b;
      }
      return -c / 2 * ((--t) * (t - 2) - 1) + b;
    },
    easeInCubic: function(t, b, c, d) {
      return c * (t /= d) * t * t + b;
    },
    easeOutCubic: function(t, b, c, d) {
      return c * ({
        t: t / d - 1
      } * t * t + 1) + b;
    },
    easeInOutCubic: function(t, b, c, d) {
      if ((t /= d / 2) < 1) {
        return c / 2 * t * t * t + b;
      }
      return c / 2 * ((t -= 2) * t * t + 2) + b;
    },
    easeInQuart: function(t, b, c, d) {
      return c * (t /= d) * t * t * t + b;
    },
    easeOutQuart: function(t, b, c, d) {
      return -c * ({
        t: t / d - 1
      } * t * t * t - 1) + b;
    },
    easeInOutQuart: function(t, b, c, d) {
      if ((t /= d / 2) < 1) {
        return c / 2 * t * t * t * t + b;
      }
      return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
    },
    easeInQuint: function(t, b, c, d) {
      return c * (t /= d) * t * t * t * t + b;
    },
    easeOutQuint: function(t, b, c, d) {
      return c * ({
        t: t / d - 1
      } * t * t * t * t + 1) + b;
    },
    easeInOutQuint: function(t, b, c, d) {
      if ((t /= d / 2) < 1) {
        return c / 2 * t * t * t * t * t + b;
      }
      return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
    },
    easeInSine: function(t, b, c, d) {
      return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
    },
    easeOutSine: function(t, b, c, d) {
      return c * Math.sin(t / d * (Math.PI / 2)) + b;
    },
    easeInOutSine: function(t, b, c, d) {
      return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    },
    easeInExpo: function(t, b, c, d) {
      if (t === 0) {
        return b;
      } else {
        return c * Math.pow(2, 10 * (t / d - 1)) + b;
      }
    },
    easeOutExpo: function(t, b, c, d) {
      if (t === d) {
        return b + c;
      } else {
        return c * (-Math.pow(2, -10 * t / d) + 1) + b;
      }
    },
    easeInOutExpo: function(t, b, c, d) {
      if (t === 0) {
        return b;
      }
      if (t === d) {
        return b + c;
      }
      if ((t /= d / 2) < 1) {
        return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
      }
      return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
    },
    easeInCirc: function(t, b, c, d) {
      return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
    },
    easeOutCirc: function(t, b, c, d) {
      return c * Math.sqrt(1 - {
        t: t / d - 1
      } * t) + b;
    },
    easeInOutCirc: function(t, b, c, d) {
      if ((t /= d / 2) < 1) {
        return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
      }
      return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
    },
    easeInElastic: function(t, b, c, d, a, p) {
      var s;
      if (t === 0) {
        return b;
      }
      if ((t /= d) === 1) {
        return b + c;
      }
      if (!p) {
        p = d * .3;
      }
      if (a < Math.abs(c)) {
        a = c;
        s = p / 4;
      } else {
        s = p / (2 * Math.PI) * Math.asin(c / a);
      }
      return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    },
    easeOutElastic: function(t, b, c, d, a, p) {
      var s;
      if (t === 0) {
        return b;
      }
      if ((t /= d) === 1) {
        return b + c;
      }
      if (!p) {
        p = d * .3;
      }
      if (a < Math.abs(c)) {
        a = c;
        s = p / 4;
      } else {
        s = p / (2 * Math.PI) * Math.asin(c / a);
      }
      return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
    },
    easeInOutElastic: function(t, b, c, d, a, p) {
      var s;
      if (t === 0) {
        return b;
      }
      if ((t /= d / 2) === 2) {
        return b + c;
      }
      if (!p) {
        p = d * (.3 * 1.5);
      }
      if (a < Math.abs(c)) {
        a = c;
        s = p / 4;
      } else {
        s = p / (2 * Math.PI) * Math.asin(c / a);
      }
      if (t < 1) {
        return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
      }
      return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
    },
    easeInBack: function(t, b, c, d, s) {
      if (s === undefined) {
        s = 1.70158;
      }
      return c * (t /= d) * t * ((s + 1) * t - s) + b;
    },
    easeOutBack: function(t, b, c, d, s) {
      if (s === undefined) {
        s = 1.70158;
      }
      return c * ({
        t: t / d - 1
      } * t * ((s + 1) * t + s) + 1) + b;
    },
    easeInOutBack: function(t, b, c, d, s) {
      if (s === undefined) {
        s = 1.70158;
      }
      if ((t /= d / 2) < 1) {
        return c / 2 * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
      }
      return c / 2 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
    },
    easeInBounce: function(t, b, c, d) {
      return c - easeOutBounce(d - t, 0, c, d) + b;
    },
    easeOutBounce: function(t, b, c, d) {
      if ((t /= d) < (1 / 2.75)) {
        return c * (7.5625 * t * t) + b;
      } else if (t < (2 / 2.75)) {
        return c * (7.5625 * (t -= 1.5 / 2.75) * t + .75) + b;
      } else if (t < (2.5 / 2.75)) {
        return c * (7.5625 * (t -= 2.25 / 2.75) * t + .9375) + b;
      } else {
        return c * (7.5625 * (t -= 2.625 / 2.75) * t + .984375) + b;
      }
    },
    easeInOutBounce: function(t, b, c, d) {
      if (t < d / 2) {
        return easeInBounce(t * 2, 0, c, d) * .5 + b;
      }
      return easeOutBounce(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
    }
  };
});

define('Invoke', ['Util'], function(U) {
  var Invoke;
  return Invoke = (function() {
    function Invoke(config) {
      U.extend(this, config);
      this.reset();
    }

    Invoke.prototype.reset = function() {
      return this.done = false;
    };

    Invoke.prototype.reverse = function() {
      return new Invoke({
        func: this.func,
        context: this.context
      });
    };

    Invoke.prototype.update = function() {
      if (this.done) {
        return;
      }
      this.func.call(this.context);
      return this.done = true;
    };

    return Invoke;

  })();
});

var __slice = [].slice;

define("Repeat", ["Util"], function(U) {
  var Repeat;
  return Repeat = (function() {
    function Repeat(count, children) {
      this.count = count;
      this.children = children != null ? children : [];
      this._currentChild = 0;
      this._curCount = 0;
    }

    Repeat.prototype.reset = function() {
      var child, _i, _len, _results;
      this.done = false;
      this._currentChild = 0;
      this._curCount = 0;
      _results = [];
      for (_i = 0, _len = children.length; _i < _len; _i++) {
        child = children[_i];
        _results.push(child.reset());
      }
      return _results;
    };

    Repeat.prototype.reverse = function() {
      var child, reversedChildren;
      reversedChildren = (function() {
        var _i, _len, _ref, _results;
        _ref = this.children;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          child = _ref[_i];
          _results.push(child.reverse());
        }
        return _results;
      }).call(this);
      return new Repeat(this.count, reversedChildren);
    };

    Repeat.prototype.update = function() {
      var args, child, curChild, _i, _len, _ref, _results;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      this.done = this._curCount >= this.count;
      if (this.done) {
        return;
      }
      curChild = this.children[this._currentChild];
      curChild.update.apply(curChild, args);
      if (curChild.done) {
        ++this._currentChild;
        if (this._currentChild >= this.children.length) {
          this._currentChild = 0;
          ++this._curCount;
          this.done = this._curCount >= this.count;
          if (!this.done) {
            _ref = this.children;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              child = _ref[_i];
              _results.push(child.reset());
            }
            return _results;
          }
        }
      }
    };

    return Repeat;

  })();
});

var __slice = [].slice;

define("Together", function() {
  var Together;
  return Together = (function() {
    function Together(children) {
      this.children = children != null ? children : [];
    }

    Together.prototype.reset = function() {
      var child, _i, _len, _ref, _results;
      this.done = false;
      _ref = this.children;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        _results.push(child.reset());
      }
      return _results;
    };

    Together.prototype.reverse = function() {
      var child, reversedChildren;
      reversedChildren = (function() {
        var _i, _len, _ref, _results;
        _ref = this.children;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          child = _ref[_i];
          _results.push(child.reverse());
        }
        return _results;
      }).call(this);
      return new Together(reversedChildren);
    };

    Together.prototype.update = function() {
      var args, child, childNotDone, _i, _len, _ref;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (this.done) {
        return;
      }
      childNotDone = false;
      _ref = this.children;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        child.update.apply(child, args);
        if (!child.done) {
          childNotDone = true;
        }
      }
      return this.done = !childNotDone;
    };

    return Together;

  })();
});

define('Tween', ['Easing', 'Util'], function(Easing, U) {
  var Tween, _idCounter;
  _idCounter = 0;
  return Tween = (function() {
    function Tween(config) {
      U.extend(this, config);
      this._saveProperty = this.property + "_save_" + (_idCounter++);
      this._nonJitteredProperty = this.property + "_nonJittered_" + (_idCounter++);
      this.easeFunc = Easing[this.easing || "linearTween"] || Easing.linearTween;
      this.reset();
    }

    Tween.prototype.reset = function() {
      this._elapsed = 0;
      this.done = this._elapsed >= this.duration;
      return this._targetsInitted = false;
    };

    Tween.prototype.reverse = function() {
      return new Tween({
        property: this.property,
        targets: this.targets,
        from: this.to,
        to: this.from,
        easing: this.easing,
        duration: this.duration
      });
    };

    Tween.prototype._initTargets = function() {
      var curValue, target, value, _i, _len, _ref;
      _ref = this.targets;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        target = _ref[_i];
        curValue = this._getProperty(target, this.property);
        if (U.isArray(curValue)) {
          this._setProperty(target, this._saveProperty, curValue.slice(0));
        } else {
          this._setProperty(target, this._saveProperty, curValue);
        }
        value = this.from != null ? this.from : target[this.property];
        if ((curValue != null) && (!U.areSameTypes(value, curValue) || !U.areSameTypes(value, this.to))) {
          throw new Error("Tween: mismatched types between from/to and targets current value");
        }
        if (U.isArray(value)) {
          value = value.slice(0);
        }
        this._setProperty(target, this.property, value);
      }
      return this._targetsInitted = true;
    };

    Tween.prototype.update = function(delta) {
      var target, _i, _len, _ref;
      if (this.done || this.disabled) {
        return;
      }
      if (!this._targetsInitted) {
        this._initTargets();
      }
      this._elapsed += delta;
      if (this._elapsed > this.duration) {
        this._elapsed = this.duration;
        this.done = true;
      } else {
        _ref = this.targets;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          target = _ref[_i];
          this._tween(target);
        }
      }
      if (this.done) {
        return this._finish();
      }
    };

    Tween.prototype._finish = function() {
      var finalValue, target, _i, _len, _ref, _results;
      _ref = this.targets;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        target = _ref[_i];
        finalValue = this.restoreAfter ? this._getProperty(target, this._saveProperty) : this.to;
        this._setProperty(target, this.property, finalValue);
        this._deleteProperty(target, this._saveProperty);
        _results.push(this._deleteProperty(target, this._nonJitteredProperty));
      }
      return _results;
    };

    Tween.prototype._getProperty = function(target, propertyPath) {
      var path, paths, _i, _len;
      paths = propertyPath.split(".");
      for (_i = 0, _len = paths.length; _i < _len; _i++) {
        path = paths[_i];
        target = target[path];
      }
      return target;
    };

    Tween.prototype._setProperty = function(target, propertyPath, value) {
      var i, paths, _i, _ref;
      paths = propertyPath.split(".");
      for (i = _i = 0, _ref = paths.length - 1; _i < _ref; i = _i += 1) {
        target = target[paths[i]];
      }
      return target[paths[paths.length - 1]] = value;
    };

    Tween.prototype._deleteProperty = function(target, propertyPath) {
      var i, paths, _i, _ref;
      paths = propertyPath.split(".");
      for (i = _i = 0, _ref = paths.length - 1; _i < _ref; i = _i += 1) {
        target = target[paths[i]];
      }
      return delete target[paths[paths.length - 1]];
    };

    Tween.prototype._tween = function(target) {
      var cell, curValue, from, i, tweenedValue, _i, _len, _results;
      curValue = this._getProperty(target, this.property);
      if (U.isArray(curValue)) {
        _results = [];
        for (i = _i = 0, _len = curValue.length; _i < _len; i = ++_i) {
          cell = curValue[i];
          from = this.from || target[this._saveProperty];
          _results.push(curValue[i] = this._tweenValue(this._elapsed, from[i], this.to[i], this.duration));
        }
        return _results;
      } else if (U.isNumber(curValue)) {
        tweenedValue = this._tweenValue(this._elapsed, this.from, this.to, this.duration);
        return this._setProperty(target, this.property, tweenedValue);
      } else {
        throw new Error("Tween can only operate on numbers or arrays of numbers");
      }
    };

    Tween.prototype._tweenValue = function(elapsed, from, to, duration) {
      var position;
      position = this.easeFunc(elapsed, from, to - from, duration);
      if (U.isNumber(this.jitterMin)) {
        position += U.rand(this.jitterMin, this.jitterMax || 0);
      }
      return position;
    };

    return Tween;

  })();
});

define('Wait', ['Util'], function(U) {
  var Wait;
  return Wait = (function() {
    function Wait(config) {
      U.extend(this, config);
      if ((this.min != null) && (this.max != null) && this.min > this.max) {
        throw new Error("Wait: min must be less than max");
      }
      this._specifiedDuration = this.duration;
      this.reset();
    }

    Wait.prototype.reverse = function() {
      return new Wait({
        duration: this.duration
      });
    };

    Wait.prototype.reset = function() {
      this.duration = this._specifiedDuration || U.rand(this.min, this.max);
      this._elapsed = 0;
      return this.done = this._elapsed >= this.duration;
    };

    Wait.prototype.update = function(delta) {
      if (this.done) {
        return;
      }
      this._elapsed += delta;
      return this.done = this._elapsed >= this.duration;
    };

    return Wait;

  })();
});

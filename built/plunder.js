define('Timeline', ['Util', 'Tween'], function(U, Tween) {
  var Timeline;
  return Timeline = (function() {
    function Timeline(owner) {
      if (!owner) {
        throw new Error("Timeline requires an owner");
      }
      this._owner = owner;
      this._buildStack = [];
      this._targetStack = [];
      this._addedAnis = [];
    }

    Timeline.prototype._getTargets = function(targetOptions) {
      var targets, _ref, _ref1;
      targets = (_ref = (_ref1 = targetOptions.targets) != null ? _ref1 : targetOptions.target) != null ? _ref : this._owner;
      return U.toArray(targets);
    };

    Timeline.prototype._addAnimationToOwner = function(ani) {
      this._addedAnis.push(ani);
      return this._owner._addAni(ani);
    };

    Timeline.prototype._addParentAnimation = function(builder, targetOptions, AniConstructor, consArg) {
      var ani, targets;
      ani = new AniConstructor(consArg);
      if (targetOptions) {
        targets = this._getTargets(targetOptions);
        this._targetStack.push(targets);
      }
      this._buildStack.push(ani);
      builder(this);
      this._buildStack.pop();
      if (targetOptions) {
        this._targetStack.pop();
      }
      if (this._buildStack.length === 0) {
        this._addAnimationToOwner(ani);
      } else {
        this._buildStack[this._buildStack.length - 1].children.push(ani);
      }
      return ani;
    };

    Timeline.prototype._addAnimation = function(config, AniConstructor) {
      var ani;
      if (!config.targets) {
        if (config.target) {
          config.targets = config.target;
        } else if (this._targetStack.length > 0) {
          config.targets = this._targetStack.last;
        } else {
          config.targets = this._owner;
        }
      }
      config.targets = U.toArray(config.targets);
      ani = new AniConstructor(config);
      if (this._buildStack.length === 0) {
        this._addAnimationToOwner(ani);
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
      return this._addAnimation(config, Tween);
    };

    Timeline.prototype.setProperty = function(config) {
      config.duration = 0;
      config.from = config.to = config.value;
      return this.tween(config);
    };

    Timeline.prototype.copyProperty = function(config) {
      return this._addAnimation(config, CopyProperty);
    };

    Timeline.prototype.tween = function(config) {
      return this._addAnimation(config, Tween);
    };

    Timeline.prototype.frame = function(config) {
      return this._addAnimation(config, Frame);
    };

    Timeline.prototype.fadeIn = function(config) {
      return this._fade(config, 0, 1);
    };

    Timeline.prototype.fadeOut = function(config) {
      return this._fade(config, 1, 0);
    };

    Timeline.prototype.sequence = function(targetOptionsOrBuilder, builderOrUndefined) {
      return this.repeat(1, targetOptionsOrBuilder, builderOrUndefined);
    };

    Timeline.prototype.together = function(targetOptionsOrBuilder, builderOrUndefined) {
      var builder, targetOptions;
      if (U.isFunction(targetOptionsOrBuilder)) {
        builder = targetOptionsOrBuilder;
      } else {
        targetOptions = targetOptionsOrBuilder;
        builder = builderOrUndefined;
      }
      return this._addParentAnimation(builder, targetOptions, Together);
    };

    Timeline.prototype.repeat = function(count, targetOptionsOrBuilder, builderOrUndefined) {
      var builder, targetOptions;
      if (U.isFunction(targetOptionsOrBuilder)) {
        builder = targetOptionsOrBuilder;
      } else {
        targetOptions = targetOptionsOrBuilder;
        builder = builderOrUndefined;
      }
      return this._addParentAnimation(builder, targetOptions, Repeat, count);
    };

    Timeline.prototype.wait = function(millis) {
      return this.waitBetween(millis, millis);
    };

    Timeline.prototype.waitBetween = function(min, max) {
      return this._addAnimation({
        min: min,
        max: max
      }, Wait);
    };

    Timeline.prototype.invoke = function(func) {
      return this._addAnimation({
        func: func
      }, Invoke);
    };

    Timeline.prototype.setAnimation = function(config) {
      return this._addAnimation(config, SetAnimation);
    };

    Timeline.prototype.end = function() {
      var me, rootAni;
      rootAni = this._buildStack.first;
      if (rootAni) {
        me = this;
        return this.invoke(function() {
          return me.die();
        });
      }
    };

    Timeline.prototype.die = function() {
      var _ref;
      return (_ref = this._owner) != null ? _ref._clearAnis() : void 0;
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
        return this.isArray(a);
      }
      return typeof a === typeof b;
    },
    extend: function(target, incoming) {
      var key, value, _results;
      if (target != null) {
        _results = [];
        for (key in incoming) {
          if (!__hasProp.call(incoming, key)) continue;
          value = incoming[key];
          _results.push(target[key] = value);
        }
        return _results;
      }
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
    }
  };
  Util.isArray = Array.isArray || function(obj) {
    return toString.call(obj) === "[object Array]";
  };
  return Util;
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
      return this._initTargets();
    };

    Tween.prototype._initTargets = function() {
      var curValue, target, value, _i, _len, _ref, _results;
      _ref = this.targets;
      _results = [];
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
        _results.push(this._setProperty(target, this.property, value));
      }
      return _results;
    };

    Tween.prototype.update = function(delta) {
      var target, _i, _len, _ref;
      if (this.done || this.disabled) {
        return;
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

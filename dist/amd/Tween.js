define(['./Easing', './Util'], function(Easing, U) {
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
      if (this._elapsed >= this.duration) {
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

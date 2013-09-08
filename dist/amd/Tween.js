define(['./Easie', './Util', './Accessor'], function(Easie, U, Accessor) {
  var Tween, _idCounter;
  _idCounter = 0;
  return Tween = (function() {
    function Tween(config) {
      this.id = _idCounter++;
      U.extend(this, config);
      this._saveProperty = "_plunder_tween_save_" + this.id;
      this._accessorProp = "__accessorProp" + this.id;
      this.easeFunc = Easie[this.easing || "linear"] || Easie.linear;
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
        easing: Easie.reverse(this.easing),
        duration: this.duration
      });
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

    Tween.prototype._initTargets = function() {
      var curValue, target, value, _i, _len, _ref, _ref1;
      _ref = this.targets;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        target = _ref[_i];
        target[this._accessorProp] = new Accessor(target, this.property);
        curValue = this._get(target);
        target[this._saveProperty] = U.isArray(curValue) ? curValue.slice(0) : curValue;
        value = (_ref1 = this.from) != null ? _ref1 : curValue;
        if ((curValue != null) && (!U.areSameTypes(value, curValue) || !U.areSameTypes(value, this.to))) {
          throw new Error("Tween: mismatched types between from/to and targets current value");
        }
        if (U.isArray(value)) {
          value = value.slice(0);
        }
        this._set(target, value);
      }
      return this._targetsInitted = true;
    };

    Tween.prototype._finish = function() {
      var finalValue, target, _i, _len, _ref, _results;
      _ref = this.targets;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        target = _ref[_i];
        finalValue = this.restoreAfter ? target[this._saveProperty] : this.to;
        this._set(target, finalValue);
        _results.push(this._del(target));
      }
      return _results;
    };

    Tween.prototype._tween = function(target) {
      var cell, curValue, from, i, tweenedValue, _i, _len, _ref, _results;
      curValue = this._get(target);
      from = (_ref = this.from) != null ? _ref : target[this._saveProperty];
      if (U.isArray(curValue)) {
        _results = [];
        for (i = _i = 0, _len = curValue.length; _i < _len; i = ++_i) {
          cell = curValue[i];
          _results.push(curValue[i] = this._tweenValue(this._elapsed, from[i], this.to[i], this.duration));
        }
        return _results;
      } else if (U.isNumber(curValue)) {
        tweenedValue = this._tweenValue(this._elapsed, from, this.to, this.duration);
        return this._set(target, tweenedValue);
      } else {
        throw new Error("Tween can only operate on numbers or arrays of numbers");
      }
    };

    Tween.prototype._tweenValue = function(elapsed, from, to, duration) {
      return this.easeFunc(elapsed, from, to - from, duration);
    };

    Tween.prototype._get = function(target) {
      return target[this._accessorProp].get();
    };

    Tween.prototype._set = function(target, value) {
      return target[this._accessorProp].set(value);
    };

    Tween.prototype._del = function(target) {
      delete target[this._saveProperty];
      return delete target[this._accessorProp];
    };

    return Tween;

  })();
});

define(["./Util", "./Bezier", "./Tween", "./Wait", "./Repeat", "./Together", "./Invoke"], function(U, Bezier, Tween, Wait, Repeat, Together, Invoke) {
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

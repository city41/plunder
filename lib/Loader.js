var Loader, U, getBuilder;

U = require('./Util');

getBuilder = function(loader, children) {};

Loader = (function() {
  function Loader() {
    this._anis = [];
  }

  Loader.prototype._getBuilder = function(children) {
    var _this = this;
    return function(timeline) {
      var child, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = children.length; _i < _len; _i++) {
        child = children[_i];
        _results.push(_this.load(child, timeline));
      }
      return _results;
    };
  };

  Loader.prototype._findAni = function(id) {
    return this._anis.filter(function(ani) {
      return ani.id === id;
    }).pop();
  };

  Loader.prototype._getArgs = function(args) {
    var _this = this;
    return args.map(function(arg) {
      if (U.isString(arg) && arg.indexOf("id:") === 0) {
        return _this._findAni(arg.substring(3));
      } else {
        return arg;
      }
    });
  };

  Loader.prototype.load = function(aniDef, timeline) {
    var ani, args, method;
    method = timeline[aniDef.type];
    if (aniDef.children) {
      ani = method.call(timeline, aniDef.childConfig || {}, this._getBuilder(aniDef.children));
    } else {
      args = this._getArgs(aniDef.args);
      ani = method.apply(timeline, args);
    }
    ani.id = aniDef.id;
    return this._anis.push(ani);
  };

  return Loader;

})();

module.exports = Loader;

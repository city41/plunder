var Accessor, U;

U = require('./Util');

Accessor = (function() {
  function Accessor(obj, propertyPath) {
    this.obj = obj;
    this.paths = propertyPath.split(".");
  }

  Accessor.prototype.get = function() {
    var obj, path, _i, _len, _ref;
    obj = this.obj;
    _ref = this.paths;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      path = _ref[_i];
      obj = obj[path];
    }
    return obj;
  };

  Accessor.prototype.set = function(value) {
    var i, obj, _i, _name, _ref;
    obj = this.obj;
    for (i = _i = 0, _ref = this.paths.length - 1; _i < _ref; i = _i += 1) {
      if (obj[_name = this.paths[i]] == null) {
        obj[_name] = {};
      }
      obj = obj[this.paths[i]];
    }
    return obj[U.last(this.paths)] = value;
  };

  return Accessor;

})();

module.exports = Accessor;

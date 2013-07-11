define(['./Util'], function(U) {
  var Accessor;
  return Accessor = (function() {
    function Accessor(rootObj, propertyPath) {
      var paths;
      paths = propertyPath.split(".");
      this._leafPath = U.last(paths);
      this._leafObj = this._getLeaf(rootObj, paths);
    }

    Accessor.prototype.get = function() {
      return this._leafObj[this._leafPath];
    };

    Accessor.prototype.set = function(value) {
      return this._leafObj[this._leafPath] = value;
    };

    Accessor.prototype._getLeaf = function(obj, paths) {
      var i, _i, _name, _ref;
      for (i = _i = 0, _ref = paths.length - 1; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        if (obj[_name = paths[i]] == null) {
          obj[_name] = {};
        }
        obj = obj[paths[i]];
      }
      return obj;
    };

    return Accessor;

  })();
});

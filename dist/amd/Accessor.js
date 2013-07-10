define(['./Util'], function(U) {
  var Accessor;
  return Accessor = {
    getProperty: function(obj, propertyPath) {
      var path, paths, _i, _len;
      paths = propertyPath.split(".");
      for (_i = 0, _len = paths.length; _i < _len; _i++) {
        path = paths[_i];
        obj = obj[path];
      }
      return obj;
    },
    setProperty: function(obj, propertyPath, value) {
      var i, paths, _i, _name, _ref;
      paths = propertyPath.split(".");
      for (i = _i = 0, _ref = paths.length - 1; _i < _ref; i = _i += 1) {
        if (obj[_name = paths[i]] == null) {
          obj[_name] = {};
        }
        obj = obj[paths[i]];
      }
      return obj[U.last(paths)] = value;
    },
    deleteProperty: function(obj, propertyPath) {
      var i, paths, _i, _ref;
      paths = propertyPath.split(".");
      for (i = _i = 0, _ref = paths.length - 1; _i < _ref; i = _i += 1) {
        if (!obj[paths[i]]) {
          return;
        }
        obj = obj[paths[i]];
      }
      return delete obj[U.last(paths)];
    }
  };
});

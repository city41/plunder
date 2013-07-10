var __slice = [].slice;

define(function() {
  var Together;
  Together = (function() {
    function Together(children) {
      this.children = children != null ? children : [];
    }

    Together.prototype.reset = function() {
      var child, _i, _len, _ref, _results;
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
      var args, child, _i, _len, _ref, _results;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (this.done) {
        return;
      }
      _ref = this.children;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        _results.push(child.update.apply(child, args));
      }
      return _results;
    };

    return Together;

  })();
  Object.defineProperty(Together.prototype, 'done', {
    get: function() {
      var child, _i, _len, _ref;
      _ref = this.children;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        if (!child.done) {
          return false;
        }
      }
      return true;
    }
  });
  return Together;
});

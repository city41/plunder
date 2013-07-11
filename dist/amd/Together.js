var __slice = [].slice;

define(function() {
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

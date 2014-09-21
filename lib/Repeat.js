var Repeat, U,
  __slice = [].slice;

U = require('./Util');

Repeat = (function() {
  function Repeat(count, children) {
    this.count = count;
    this.children = children != null ? children : [];
    this._currentChild = 0;
    this._curCount = 0;
  }

  Repeat.prototype.reset = function() {
    var child, _i, _len, _ref, _results;
    this.done = false;
    this._currentChild = 0;
    this._curCount = 0;
    _ref = this.children;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      _results.push(child.reset());
    }
    return _results;
  };

  Repeat.prototype.reverse = function() {
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
    return new Repeat(this.count, reversedChildren.reverse());
  };

  Repeat.prototype.update = function() {
    var args, child, curChild, _i, _len, _ref, _results;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    this.done = this._curCount >= this.count;
    if (this.done) {
      return;
    }
    curChild = this.children[this._currentChild];
    curChild.update.apply(curChild, args);
    if (curChild.done) {
      ++this._currentChild;
      if (this._currentChild >= this.children.length) {
        this._currentChild = 0;
        ++this._curCount;
        this.done = this._curCount >= this.count;
        if (!this.done) {
          _ref = this.children;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            child = _ref[_i];
            _results.push(child.reset());
          }
          return _results;
        }
      }
    }
  };

  return Repeat;

})();

module.exports = Repeat;

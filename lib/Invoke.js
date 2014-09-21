var Invoke, U;

U = require('./Util');

Invoke = (function() {
  function Invoke(config) {
    U.extend(this, config);
    this.reset();
  }

  Invoke.prototype.reset = function() {
    return this.done = false;
  };

  Invoke.prototype.reverse = function() {
    return new Invoke({
      func: this.func,
      context: this.context
    });
  };

  Invoke.prototype.update = function() {
    if (this.done) {
      return;
    }
    this.func.call(this.context);
    return this.done = true;
  };

  return Invoke;

})();

module.exports = Invoke;

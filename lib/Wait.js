var U, Wait;

U = require('./Util');

Wait = (function() {
  function Wait(config) {
    U.extend(this, config);
    if ((this.min != null) && (this.max != null) && this.min > this.max) {
      throw new Error("Wait: min must be less than max");
    }
    this._specifiedDuration = this.duration;
    this.reset();
  }

  Wait.prototype.reverse = function() {
    return new Wait({
      duration: this.duration
    });
  };

  Wait.prototype.reset = function() {
    this.duration = this._specifiedDuration || U.rand(this.min, this.max);
    this._elapsed = 0;
    return this.done = this._elapsed >= this.duration;
  };

  Wait.prototype.update = function(delta) {
    if (this.done) {
      return;
    }
    this._elapsed += delta;
    return this.done = this._elapsed >= this.duration;
  };

  return Wait;

})();

module.exports = Wait;

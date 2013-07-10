define(['./Util'], function(U) {
  var Wait;
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
      return this._elapsed = 0;
    };

    Wait.prototype.update = function(delta) {
      if (this.done) {
        return;
      }
      return this._elapsed += delta;
    };

    return Wait;

  })();
  Object.defineProperty(Wait.prototype, 'done', {
    get: function() {
      return this._elapsed >= this.duration;
    }
  });
  return Wait;
});

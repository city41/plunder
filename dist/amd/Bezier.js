define(['./Util'], function(U) {
  var Bezier;
  Bezier = (function() {
    function Bezier(config) {
      U.extend(this, config);
      this.reset();
    }

    Bezier.prototype.reset = function() {
      this._elapsed = 0;
      return this._targetsInitted = false;
    };

    Bezier.prototype.reverse = function() {
      return new Bezier({
        targets: this.targets,
        points: this._reversePoints(this.points),
        duration: this.duration
      });
    };

    Bezier.prototype._reversePoints = function(points) {
      points = U.clone(points);
      this._swap(points, 0, 3);
      this._swap(points, 1, 2);
      return points;
    };

    Bezier.prototype._swap = function(array, a, b) {
      var temp;
      temp = array[a];
      array[a] = array[b];
      return array[b] = temp;
    };

    Bezier.prototype._initTargets = function() {
      var target, _i, _len, _ref;
      _ref = this.targets;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        target = _ref[_i];
        target.x = this.points[0].x;
        target.y = this.points[0].y;
      }
      return this._targetsInitted = true;
    };

    Bezier.prototype.update = function(delta) {
      var target, _i, _len, _ref;
      this._elapsed += delta;
      if (this.done || this.disabled) {
        return;
      }
      if (!this._targetsInitted) {
        this._initTargets();
      }
      _ref = this.targets;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        target = _ref[_i];
        this._move(target);
      }
    };

    Bezier.prototype._move = function(target) {
      var percent, x, y, _ref;
      percent = this._elapsed / this.duration;
      _ref = this._computeBezier(0, percent), x = _ref.x, y = _ref.y;
      target.x = x;
      return target.y = y;
    };

    Bezier.prototype._computeBezier = function(index, time) {
      var oneMinusT, oneMinusTCubed, p1, p2, p3, p4, t, tCubed, x, x1, x2, x3, x4, y, y1, y2, y3, y4;
      t = time;
      p1 = this.points[index];
      p2 = this.points[index + 1];
      p3 = this.points[index + 2];
      p4 = this.points[index + 3];
      oneMinusT = 1 - t;
      oneMinusTCubed = oneMinusT * oneMinusT * oneMinusT;
      tCubed = t * t * t;
      x1 = oneMinusTCubed * p1.x;
      x2 = 3 * t * oneMinusT * oneMinusT * p2.x;
      x3 = 3 * t * t * oneMinusT * p3.x;
      x4 = tCubed * p4.x;
      x = x1 + x2 + x3 + x4;
      y1 = oneMinusTCubed * p1.y;
      y2 = 3 * t * oneMinusT * oneMinusT * p2.y;
      y3 = 3 * t * t * oneMinusT * p3.y;
      y4 = tCubed * p4.y;
      y = y1 + y2 + y3 + y4;
      return {
        x: x,
        y: y
      };
    };

    return Bezier;

  })();
  Object.defineProperty(Bezier.prototype, 'done', {
    get: function() {
      return this._elapsed >= this.duration;
    }
  });
  return Bezier;
});

require(['Timeline', 'Util'], function(Timeline, U) {
  var Entity, context, entity, lastTimestamp, tl, update;
  Entity = (function() {
    function Entity() {
      this.anis = [];
      this.x = 10;
      this.y = 10;
      this.alpha = 1;
      this.color = [255, 0, 0, 1];
    }

    Entity.prototype.addAni = function(ani) {
      return this.anis.push(ani);
    };

    Entity.prototype.clearAnis = function() {
      return this.anis = [];
    };

    Entity.prototype.update = function(delta) {
      var ani, _i, _len, _ref, _results;
      _ref = this.anis;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        ani = _ref[_i];
        _results.push(ani.update(delta));
      }
      return _results;
    };

    Entity.prototype.draw = function(context) {
      context.save();
      context.fillStyle = "rgba(" + (this.color[0] | 0) + ", " + (this.color[1] | 0) + ", " + (this.color[2] | 0) + ", " + this.color[3] + ")";
      context.translate(this.x, this.y);
      if (this.scale) {
        context.scale(this.scale, this.scale);
      }
      if (this.angle) {
        context.rotate(U.degreesToRadians(this.angle));
      }
      context.fillRect(-5, -5, 10, 10);
      return context.restore();
    };

    return Entity;

  })();
  entity = new Entity();
  tl = new Timeline(entity);
  tl.forever(function() {
    var group;
    group = tl.together(function() {
      tl.rotate({
        from: 0,
        to: 720,
        duration: 2000
      });
      tl.color({
        from: [255, 0, 0, 1],
        to: [0, 0, 255, 0],
        duration: 2000
      });
      tl.scale({
        from: 1,
        to: 10,
        duration: 2000
      });
      return tl.move({
        from: {
          x: 10,
          y: 10
        },
        to: {
          x: 300,
          y: 200
        },
        duration: 2000
      });
    });
    tl.wait(500);
    return tl.reverse(group);
  });
  context = document.getElementById('canvas').getContext('2d');
  lastTimestamp = null;
  update = function(ts) {
    var delta;
    if (lastTimestamp == null) {
      lastTimestamp = ts;
    }
    delta = ts - lastTimestamp;
    lastTimestamp = ts;
    entity.update(delta);
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    entity.draw(context);
    return window.requestAnimationFrame(update);
  };
  return update(0);
});

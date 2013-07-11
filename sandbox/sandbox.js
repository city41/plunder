require(['../dist/plunder'], function(plunder) {
  var Entity, Timeline, U, context, entity, lastTimestamp, update;
  Timeline = plunder.Timeline;
  U = plunder.Util;
  Entity = (function() {
    function Entity() {
      this.timeline = new Timeline(this);
      this.anis = [];
      this.pos = {
        x: 10,
        y: 10
      };
      this.x = 10;
      this.y = 10;
      this.alpha = 1;
      this.color = [255, 0, 0, 1];
    }

    Entity.prototype.bezier = function() {
      var tl;
      tl = this.timeline;
      return tl.forever({
        duration: 2000
      }, function() {
        var t;
        tl.wait(1000);
        t = tl.together(function() {
          tl.color({
            from: [255, 0, 0, 1],
            to: [0, 0, 255, 1]
          });
          tl.sequence({
            duration: 1000
          }, function() {
            var s;
            s = tl.scale({
              from: 1,
              to: 4
            });
            return tl.reverse(s);
          });
          return tl.bezier({
            points: [
              {
                x: 10,
                y: 10
              }, {
                x: 10,
                y: 60
              }, {
                x: 100,
                y: 40
              }, {
                x: 100,
                y: 100
              }
            ]
          });
        });
        tl.wait(1000);
        return tl.reverse(t);
      });
    };

    Entity.prototype.nestedTween = function() {
      var tl;
      this.usePos = true;
      tl = this.timeline;
      return tl.tween({
        property: 'pos.x',
        to: 100,
        duration: 2000
      });
    };

    Entity.prototype.standard = function() {
      var tl;
      tl = this.timeline;
      return tl.forever(function() {
        var group;
        group = tl.together({
          duration: 2000
        }, function() {
          tl.rotate({
            from: 0,
            to: 720
          });
          tl.color({
            from: [255, 0, 0, 1],
            to: [0, 0, 255, 0]
          });
          tl.scale({
            from: 1,
            to: 10
          });
          return tl.move({
            from: {
              x: 10,
              y: 10
            },
            to: {
              x: 300,
              y: 200
            }
          });
        });
        tl.wait(500);
        return tl.reverse(group);
      });
    };

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
      if (this.usePos) {
        context.translate(this.pos.x, this.pos.y);
      } else {
        context.translate(this.x, this.y);
      }
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
  entity.nestedTween();
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

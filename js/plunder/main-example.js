(function(){
  var Timeline = Plunder.Timeline, U = Plunder.Util;

  window.raf = window.requestAnimationFrame
	|| window.mozRequestAnimationFrame
	|| window.webkitRequestAnimationFrame
	|| window.msRequestAnimationFrame;

  var Entity, context, entity, lastTimestamp, tl, update;
  var playing = true;
  Entity = (function() {
    function Entity() {
      this.anis = [];
      this.x = 10;
      this.y = 10;
      this.alpha = 1;
      this.color = [0, 0, 0, 0];
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
      if (this.scale != null) {
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
  tl.forever(function(tl) {
    var t = tl.together( { duration: 2000 }, function(tl) {
      tl.rotate({
	from: 0,
	to: 360
      });
      tl.color({
        from: [255, 0, 0, 1],
        to: [255, 255, 0, 0.3]
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
          x: 250,
          y: 100
        }
      });
    });
    tl.wait(1000);
    tl.reverse(t);
  });
  context = document.getElementById('canvas').getContext('2d');
  var button= document.getElementById('play-main-example');


  button.onclick = function() {
    playing = !playing;

    if(playing) {
      lastTimestamp = null;
      update(0);
      button.innerHTML = "Pause";
    } else {
      button.innerHTML = "Play";
    }
  };

  lastTimestamp = null;
  update = function(ts) {
    if (!playing) return;

    var delta;
    if (lastTimestamp == null) {
      lastTimestamp = ts;
    }
    delta = ts - lastTimestamp;
    lastTimestamp = ts;
    entity.update(delta);
    context.fillStyle = '#1d1f21';
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    entity.draw(context);
    return window.raf(update);
  };
  return update(0);
})();

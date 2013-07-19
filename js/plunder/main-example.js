(function(){
  var Timeline = Plunder.Timeline, U = Plunder.Util;

  window.raf = window.requestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.msRequestAnimationFrame;

  var Entity, context, entity, lastTimestamp, tl, update, button, playing = true;

  Entity = function() {
    this.anis = [];
    this.x = 10;
    this.y = 10;
    this.alpha = 1;
    this.color = [0, 0, 0, 0];
  };

  Entity.prototype = {
    addPlunderAnimation: function(ani) {
      this.anis.push(ani);
    },

    clearPlunderAnimations: function() {
      this.anis = [];
    },

    update: function(delta) {
      for(var i = 0, l = this.anis.length; i < l; ++i) {
        this.anis[i].update(delta);
      }
    },

    draw: function(context) {
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
      context.restore();
    }
  };

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
      tl.move({
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
  button = document.getElementById('play-main-example');

  button.addEventListener('click', function() {
    playing = !playing;

    if(playing) {
      button.innerHTML = "Pause";
    } else {
      button.innerHTML = "Play";
    }
  });

  lastTimestamp = null;

  update = function(ts) {
    var delta;
    if (lastTimestamp == null) {
      lastTimestamp = ts;
    }
    delta = ts - lastTimestamp;
    lastTimestamp = ts;

    if(playing) {
      entity.update(delta);
      context.fillStyle = '#1d1f21';
      context.fillRect(0, 0, context.canvas.width, context.canvas.height);
      entity.draw(context);
    }
    window.raf(update);
  };

  update(0);
})();

require(['Timeline'], function(Timeline) {
  var Entity, context, entity, lastTimestamp, tl, update;
  Entity = (function() {
    function Entity() {
      this.anis = [];
      this._x = 10;
      this._y = 10;
      Object.defineProperties(this, {
        x: {
          get: function() {
            return this._x;
          },
          set: function(x) {
            return this._x = x;
          }
        },
        y: {
          get: function() {
            return this._y;
          },
          set: function(y) {
            return this._y = y;
          }
        }
      });
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
      debugger;
      context.fillStyle = 'red';
      return context.fillRect(this.x, this.y, 10, 10);
    };

    return Entity;

  })();
  entity = new Entity();
  tl = new Timeline(entity);
  tl.repeat(2, function(tl) {
    tl.together(function(tl) {
      tl.tween({
        property: 'y',
        from: 10,
        to: 50,
        duration: 2000
      });
      return tl.tween({
        property: 'x',
        from: 10,
        to: 100,
        duration: 2000,
        easing: 'easeInOutQuad'
      });
    });
    tl.wait(500);
    return tl.together(function(tl) {
      tl.tween({
        property: 'y',
        from: 50,
        to: 10,
        duration: 2000
      });
      return tl.tween({
        property: 'x',
        from: 100,
        to: 10,
        duration: 2000,
        easing: 'easeInOutQuad'
      });
    });
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

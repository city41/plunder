ig.module("plugins.plunder-entity").requires("impact.entity").defines(function() {
  return ig.Entity.inject({
    init: function(x, y, settings) {
      this.ani = new Timeline(this);
      this.anis = [];
      return this.parent(x, y, settings);
    },
    update: function() {
      var ani, _i, _len, _ref;
      _ref = this.anis;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        ani = _ref[_i];
        ani.update(ig.system.tick);
      }
      return this.parent();
    },
    addPlunderAnimation: function(ani) {
      return this.anis.push(ani);
    },
    clearPlunderAnimations: function() {
      return this.anis = [];
    },
    draw: function() {
      var originalAlpha;
      originalAlpha = ig.system.context.globalAlpha;
      ig.system.context.globalAlpha = this.alpha != null ? this.alpha : originalAlpha;
      this.parent();
      return ig.system.context.globalAlpha = originalAlpha;
    }
  });
});

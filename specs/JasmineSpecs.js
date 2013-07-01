(function() {
  require(['foo'], function(foo) {
    return describe('foo', function() {
      return it('should return 2', function() {
        return expect(foo.bar()).toBe(2);
      });
    });
  });

}).call(this);

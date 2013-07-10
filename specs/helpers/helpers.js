beforeEach(function() {
  return this.addMatchers({
    toHaveProperty: function(expected) {
      var notText;
      notText = this.isNot ? " not" : "";
      this.message = function() {
        return "Expected " + notText + " to have property " + expected;
      };
      return this.actual.hasOwnProperty(expected);
    }
  });
});

beforeEach(function() {
  return this.addMatchers({
    toBeInstanceOf: function(expected) {
      var notText;
      notText = this.isNot ? " not" : "";
      this.message = function() {
        return "Expected " + this.actual + notText + " to be instance of " + expected;
      };
      return this.actual instanceof expected;
    }
  });
});

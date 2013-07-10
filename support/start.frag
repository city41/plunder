(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    root.Plunder = factory();
  }
}(this, function () {

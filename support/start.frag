(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof module === 'object'){
    module.exports = factory();
  } else {
    root.Plunder = factory();
  }
}(this, function () {

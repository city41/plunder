(function() {
  require(['Util'], function(U) {
    return describe("Util", function() {
      describe("#toArray", function() {
        it("should pass arrays through", function() {
          var a, b;
          a = [1, 2, 3];
          b = U.toArray(a);
          return expect(b).toBe(a);
        });
        it("should wrap non arrays into an array", function() {
          return expect(U.toArray(12)).toEqual([12]);
        });
        it("should convert null into an empty array", function() {
          return expect(U.toArray(null)).toEqual([]);
        });
        return it("should convert undefined into an empty array", function() {
          return expect(U.toArray()).toEqual([]);
        });
      });
      describe("#isNumber", function() {
        it("should say an integer is a number", function() {
          return expect(U.isNumber(81)).toBeTruthy();
        });
        it("should say a float is a number", function() {
          return expect(U.isNumber(12.344)).toBeTruthy();
        });
        return it("should not say non numbers are numbers", function() {
          expect(U.isNumber()).toBeFalsy();
          expect(U.isNumber("hello")).toBeFalsy();
          expect(U.isNumber({})).toBeFalsy();
          return expect(U.isNumber(null)).toBeFalsy();
        });
      });
      describe("#isFunction", function() {
        it("should say a function is a function", function() {
          var fn, obj;
          expect(U.isFunction(function() {})).toBeTruthy();
          fn = function() {};
          expect(U.isFunction(fn)).toBeTruthy();
          obj = {
            foo: function() {}
          };
          return expect(U.isFunction(obj.foo)).toBeTruthy();
        });
        return it("should say non functions are not functions", function() {
          expect(U.isFunction()).toBeFalsy();
          expect(U.isFunction(12)).toBeFalsy();
          expect(U.isFunction({})).toBeFalsy();
          expect(U.isFunction(null)).toBeFalsy();
          return expect(U.isFunction("foo")).toBeFalsy();
        });
      });
      return describe("#isUndefined", function() {
        it("should say undefined is undefined", function() {
          expect(U.isUndefined(void 0)).toBeTruthy();
          return expect(U.isUndefined()).toBeTruthy();
        });
        return it("should say defined things are not undefined", function() {
          expect(U.isUndefined({})).toBeFalsy();
          expect(U.isUndefined(12)).toBeFalsy();
          expect(U.isUndefined(function() {})).toBeFalsy();
          return expect(U.isUndefined("hello")).toBeFalsy();
        });
      });
    });
  });

}).call(this);

(function() {
  require(['Tween', 'Easing'], function(Tween, Easing) {
    return describe("Tween", function() {
      var getArrayTween, getNoFromTween, getNumericTween, getTween;
      getTween = function(options, initial, from, to) {
        var property, target, tween, _ref, _ref1;
        if (options == null) {
          options = {};
        }
        target = (_ref = options.target) != null ? _ref : {
          foo: initial
        };
        property = (_ref1 = options.property) != null ? _ref1 : 'foo';
        tween = new Tween({
          targets: [target],
          property: property,
          from: from,
          to: to,
          duration: 1000,
          easing: options.easing
        });
        return {
          tween: tween,
          target: target
        };
      };
      getNumericTween = function(options, initial) {
        if (initial == null) {
          initial = 12;
        }
        return getTween(options, initial, 1, 10);
      };
      getArrayTween = function(options, initial) {
        if (initial == null) {
          initial = [0, 0, 0];
        }
        return getTween(options, initial, [1, 2, 3], [4, 5, 6]);
      };
      getNoFromTween = function(options) {
        return getTween(options, 12, void 0, 10);
      };
      describe('#constructor', function() {
        it("should set the property to the from value", function() {
          var target, tween, _ref;
          _ref = getNumericTween(), tween = _ref.tween, target = _ref.target;
          return expect(target.foo).toEqual(tween.from);
        });
        it("should keep the property as is if there is no from provided", function() {
          var target, tween, _ref;
          _ref = getNoFromTween(), tween = _ref.tween, target = _ref.target;
          return expect(target.foo).toEqual(12);
        });
        it("should not be done", function() {
          var target, tween, _ref;
          _ref = getNumericTween(), tween = _ref.tween, target = _ref.target;
          return expect(tween.done).toBe(false);
        });
        return it("should default to linearTwean for easing", function() {
          var target, tween, _ref;
          _ref = getNumericTween(), tween = _ref.tween, target = _ref.target;
          return expect(tween.easeFunc).toBe(Easing.linearTween);
        });
      });
      return describe('#update', function() {
        it("should tween all targets", function() {
          var fromValue, target, targets, tween, _i, _len, _results;
          targets = [{}, {}, {}];
          fromValue = 23;
          tween = new Tween({
            targets: targets,
            property: "foo",
            from: fromValue,
            to: 2000,
            duration: 1000
          });
          tween.update(0);
          _results = [];
          for (_i = 0, _len = targets.length; _i < _len; _i++) {
            target = targets[_i];
            _results.push(expect(target.foo).toEqual(fromValue));
          }
          return _results;
        });
        it("should update nested properties", function() {
          var target, tween, _ref;
          _ref = getNumericTween({
            target: {
              foo: {
                bar: 1
              }
            },
            property: 'foo.bar'
          }), tween = _ref.tween, target = _ref.target;
          expect(target.foo.bar).toBe(1);
          tween.update(tween.duration + 10);
          return expect(target.foo.bar).toBe(10);
        });
        it("should update each element of the array", function() {
          var originalValue, target, tween, _ref;
          originalValue = [12, 13, 14];
          _ref = getArrayTween({}, originalValue), tween = _ref.tween, target = _ref.target;
          expect(originalValue[0]).toBe(12);
          expect(originalValue[1]).toBe(13);
          expect(originalValue[2]).toBe(14);
          expect(target.foo[0]).toBe(1);
          expect(target.foo[1]).toBe(2);
          expect(target.foo[2]).toBe(3);
          tween.update(tween.duration + 10);
          expect(target.foo[0]).toBe(4);
          expect(target.foo[1]).toBe(5);
          expect(target.foo[2]).toBe(6);
          expect(originalValue[0]).toBe(12);
          expect(originalValue[1]).toBe(13);
          return expect(originalValue[2]).toBe(14);
        });
        describe("once finished", function() {
          it("should indicate it is done", function() {
            var target, tween, _ref;
            _ref = getNumericTween(), tween = _ref.tween, target = _ref.target;
            tween.update(tween.duration + 10);
            return expect(tween.done).toBeTruthy();
          });
          it("should set the property to the to value", function() {
            var target, tween, _ref;
            _ref = getNumericTween(), tween = _ref.tween, target = _ref.target;
            tween.update(tween.duration + 10);
            return expect(target.foo).toEqual(tween.to);
          });
          it("should reset to the original value if @restoreAfter is set", function() {
            var target, tween, _ref;
            _ref = getNumericTween(), tween = _ref.tween, target = _ref.target;
            tween.restoreAfter = true;
            tween.update(tween.duration / 2);
            expect(target.foo).not.toEqual(tween.to);
            expect(tween.done).toBeFalsy();
            tween.update(tween.duration + 10);
            expect(target.foo).toEqual(12);
            return expect(tween.done).toBeTruthy();
          });
          return it("shouldn't leave behind and temporary properties", function() {
            var target, tween, _ref;
            _ref = getNumericTween(), tween = _ref.tween, target = _ref.target;
            tween.update(tween.duration + 10);
            return expect(target).toEqual({
              foo: 10
            });
          });
        });
        describe("tweening", function() {
          beforeEach(function() {
            var _this = this;
            this.easingFunc = 'testEasingFunc';
            this.easedValue = 12;
            return Easing[this.easingFunc] = function() {
              return _this.easedValue;
            };
          });
          afterEach(function() {
            return delete Easing[this.easingFunc];
          });
          it("should tween values", function() {
            var target, tween, _ref;
            _ref = getNumericTween({
              easing: this.easingFunc
            }), tween = _ref.tween, target = _ref.target;
            tween.update(100);
            return expect(target.foo).toEqual(this.easedValue);
          });
          return it("should tween arrays", function() {
            var target, tween, _ref;
            _ref = getArrayTween({
              easing: this.easingFunc
            }), tween = _ref.tween, target = _ref.target;
            tween.update(100);
            expect(target.foo[0]).toEqual(this.easedValue);
            expect(target.foo[1]).toEqual(this.easedValue);
            return expect(target.foo[2]).toEqual(this.easedValue);
          });
        });
        return describe("error conditions", function() {
          it("should throw an error if asked to tween a non numeric value", function() {
            var fn, target, tween;
            target = {
              foo: 'hello'
            };
            tween = new Tween({
              targets: [target],
              property: 'foo',
              from: 'not',
              to: 'gonna happen',
              duration: 2000
            });
            fn = function() {
              return tween.update(10);
            };
            return expect(fn).toThrow();
          });
          it("should throw an error if existing property and from are of different types", function() {
            var fn, target;
            target = {
              foo: 1
            };
            fn = function() {
              var tween;
              return tween = new Tween({
                targets: [target],
                property: 'foo',
                from: [0, 0, 0],
                to: [1, 1, 1],
                duration: 2000
              });
            };
            return expect(fn).toThrow();
          });
          return it("should not throw an error if there is no existing property", function() {
            var fn, target;
            target = {};
            fn = function() {
              var tween;
              return tween = new Tween({
                targets: [target],
                property: 'foo',
                from: [0, 0, 0],
                to: [1, 1, 1],
                duration: 2000
              });
            };
            return expect(fn).not.toThrow();
          });
        });
      });
    });
  });

}).call(this);

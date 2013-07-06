(function() {
  require(["Timeline", "Tween"], function(Timeline, Tween) {
    return describe("Timeline", function() {
      var getOwner;
      getOwner = function() {
        return {
          anis: [],
          addAni: function(ani) {
            return this.anis.push(ani);
          },
          clearAnis: function() {
            return this.anis = [];
          }
        };
      };
      describe("#constructor", function() {
        return it("should throw if no owner provided", function() {
          var fn;
          fn = function() {
            return new Timeline();
          };
          expect(fn).toThrow();
          fn = function() {
            return new Timeline({});
          };
          return expect(fn).not.toThrow();
        });
      });
      describe("targets", function() {
        it("should use the owner as a target if none specified", function() {
          var owner, timeline;
          owner = getOwner();
          timeline = new Timeline(owner);
          timeline.tween({
            property: 'x'
          });
          return expect(owner.anis[0].targets[0]).toBe(owner);
        });
        it("should convert a singular target into targets", function() {
          var owner, target, timeline;
          target = {};
          owner = getOwner();
          timeline = new Timeline(owner);
          timeline.tween({
            target: target,
            property: 'x'
          });
          return expect(owner.anis[0].targets[0]).toBe(target);
        });
        return it("should use the targets", function() {
          var owner, targets, timeline;
          targets = [{}, {}];
          owner = getOwner();
          timeline = new Timeline(owner);
          timeline.tween({
            targets: targets,
            property: 'x'
          });
          expect(owner.anis[0].targets[0]).toBe(targets[0]);
          return expect(owner.anis[0].targets[1]).toBe(targets[1]);
        });
      });
      return describe("#tween", function() {
        return it("should build a tween object", function() {
          var owner, timeline;
          owner = getOwner();
          timeline = new Timeline(owner);
          timeline.tween({
            property: 'x'
          });
          return expect(owner.anis[0]).toBeInstanceOf(Tween);
        });
      });
    });
  });

}).call(this);

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
      describe("#isUndefined", function() {
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
      describe("#areSameTypes", function() {
        it("should indicate arrays are the same type", function() {
          return expect(U.areSameTypes([], [1, "foo"])).toBeTruthy();
        });
        it("should indicate numbers are the same type", function() {
          return expect(U.areSameTypes(88, 123.44)).toBeTruthy();
        });
        it("should indicate strings are the same type", function() {
          return expect(U.areSameTypes("hello", "george")).toBeTruthy();
        });
        it("should say null and an object are the same type", function() {
          return expect(U.areSameTypes(null, {})).toBeTruthy();
        });
        return it("should not say different types are the same", function() {
          expect(U.areSameTypes(null, void 0)).toBeFalsy();
          expect(U.areSameTypes("foo", 12)).toBeFalsy();
          return expect(U.areSameTypes({}, function() {})).toBeFalsy();
        });
      });
      describe("#isArray", function() {
        it("should say its an array", function() {
          var obj;
          expect(U.isArray([])).toBeTruthy();
          expect(U.isArray([1, 2, 3])).toBeTruthy();
          obj = {
            foo: [8, 9]
          };
          return expect(U.isArray(obj.foo)).toBeTruthy();
        });
        return it("should say non arrays are not arrays", function() {
          expect(U.isArray()).toBeFalsy();
          expect(U.isArray(12)).toBeFalsy();
          expect(U.isArray("not an array")).toBeFalsy();
          expect(U.isArray({})).toBeFalsy();
          return expect(U.isArray({
            '0': 1,
            '1': 8,
            '2': 5
          })).toBeFalsy();
        });
      });
      return describe("#extend", function() {
        it("should extend an object", function() {
          var incoming, obj;
          obj = {};
          incoming = {
            foo: 1,
            bar: 2
          };
          U.extend(obj, incoming);
          expect(obj.foo).toEqual(1);
          return expect(obj.bar).toEqual(2);
        });
        it("should quietly ignore null destinations", function() {
          var fn;
          fn = function() {
            return U.extend(null, {
              foo: 1
            });
          };
          return expect(fn).not.toThrow();
        });
        it("should quietly ignore undefined destinations", function() {
          var fn;
          fn = function() {
            return U.extend(void 0, {
              foo: 1
            });
          };
          return expect(fn).not.toThrow();
        });
        return it("should only apply immediate keys", function() {
          var Foo, obj, source;
          obj = {};
          Foo = (function() {
            function Foo() {}

            Foo.prototype.bar = 1;

            Foo.prototype.buz = 2;

            return Foo;

          })();
          source = new Foo();
          source.hi = 8;
          source.woah = 9;
          U.extend(obj, source);
          expect(obj.hi).toEqual(8);
          expect(obj.woah).toEqual(9);
          expect(obj.bar).toBeUndefined();
          return expect(obj.buz).toBeUndefined();
        });
      });
    });
  });

}).call(this);

(function() {
  require(['Invoke'], function(Invoke) {
    return describe("Invoke", function() {
      it("should invoke the provided function", function() {
        var invoke, obj;
        obj = {
          func: function() {}
        };
        spyOn(obj, "func");
        invoke = new Invoke({
          func: obj.func
        });
        invoke.update();
        expect(obj.func).toHaveBeenCalled();
        return expect(invoke.done).toBe(true);
      });
      return it("should reset", function() {
        var invoke;
        invoke = new Invoke({
          func: function() {}
        });
        invoke.done = true;
        invoke.reset();
        return expect(invoke.done).toBe(false);
      });
    });
  });

}).call(this);

(function() {
  require(["Repeat"], function(Repeat) {
    return describe("Repeat", function() {
      var getChild;
      getChild = function() {
        return {
          update: function() {
            var _base;
            this.done = true;
            if ((_base = this.update).called == null) {
              _base.called = 0;
            }
            return ++this.update.called;
          },
          reset: function() {}
        };
      };
      beforeEach(function() {
        this.children = [getChild(), getChild()];
        this.repeat = new Repeat(2);
        return this.repeat.children = this.children;
      });
      it("should update the @children in sequence", function() {
        var child, _i, _j, _len, _len1, _ref, _ref1, _results;
        _ref = this.children;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          child = _ref[_i];
          spyOn(child, "reset");
        }
        this.repeat.update();
        expect(this.children[0].update.called).toBe(1);
        expect(this.children[1].update.called).toBeUndefined();
        delete this.children[0].update.called;
        this.repeat.update();
        expect(this.children[0].update.called).toBeUndefined();
        expect(this.children[1].update.called).toBe(1);
        _ref1 = this.children;
        _results = [];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          child = _ref1[_j];
          _results.push(expect(child.reset).toHaveBeenCalled());
        }
        return _results;
      });
      return it("should @repeat the cycle", function() {
        this.repeat.update();
        expect(this.children[0].update.called).toBe(1);
        expect(this.children[1].update.called).toBeUndefined();
        this.repeat.update();
        expect(this.children[0].update.called).toBe(1);
        expect(this.children[1].update.called).toBe(1);
        this.repeat.update();
        expect(this.children[0].update.called).toBe(2);
        expect(this.children[1].update.called).toBe(1);
        this.repeat.update();
        expect(this.children[0].update.called).toBe(2);
        return expect(this.children[1].update.called).toBe(2);
      });
    });
  });

}).call(this);

(function() {
  require(["Together"], function(Together) {
    return describe("Together", function() {
      var getChild;
      getChild = function() {
        return {
          reset: function() {},
          update: function() {}
        };
      };
      beforeEach(function() {
        this.children = [getChild(), getChild(), getChild()];
        this.together = new Together();
        return this.together.children = this.children;
      });
      it("should reset all its children", function() {
        var child, _i, _j, _len, _len1, _ref, _ref1, _results;
        _ref = this.children;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          child = _ref[_i];
          spyOn(child, "reset");
        }
        this.together.reset();
        _ref1 = this.children;
        _results = [];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          child = _ref1[_j];
          _results.push(expect(child.reset).toHaveBeenCalled());
        }
        return _results;
      });
      it("should update all its children", function() {
        var child, _i, _j, _len, _len1, _ref, _ref1, _results;
        _ref = this.children;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          child = _ref[_i];
          spyOn(child, "update");
        }
        this.together.update();
        _ref1 = this.children;
        _results = [];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          child = _ref1[_j];
          _results.push(expect(child.update).toHaveBeenCalled());
        }
        return _results;
      });
      it("should report its done if all its children are done", function() {
        var child, _i, _len, _ref;
        _ref = this.children;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          child = _ref[_i];
          child.done = true;
        }
        this.together.update();
        return expect(this.together.done).toBeTruthy();
      });
      return it("should not report its done if all its @children are not done", function() {
        var child, _i, _len, _ref;
        _ref = this.children;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          child = _ref[_i];
          child.done = true;
        }
        this.children[1].done = false;
        this.together.update();
        return expect(this.together.done).toBeFalsy();
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

(function() {
  require(["Wait"], function(Wait) {
    var getMinMaxWait, getWait;
    getWait = function() {
      return new Wait({
        duration: 100
      });
    };
    getMinMaxWait = function(min, max) {
      if (min == null) {
        min = 10;
      }
      if (max == null) {
        max = 20;
      }
      return new Wait({
        min: min,
        max: max
      });
    };
    return describe("Wait", function() {
      describe("#constructor", function() {
        it("should not be done", function() {
          var wait;
          wait = getWait();
          return expect(wait.done).toBeFalsy();
        });
        it("should set duration from min and max", function() {
          var wait;
          wait = getMinMaxWait(5, 10);
          expect(wait.duration).toBeGreaterThan(4);
          return expect(wait.duration).toBeLessThan(11);
        });
        return it("should throw if min is greater than max", function() {
          var fn;
          fn = function() {
            return getMinMaxWait(10, 5);
          };
          return expect(fn).toThrow();
        });
      });
      return describe("#update", function() {
        return it("should wait for the specified duration", function() {
          var i, wait, _i;
          wait = getWait();
          for (i = _i = 0; _i < 99; i = ++_i) {
            wait.update(1);
            expect(wait.done).toBeFalsy();
          }
          wait.update(1);
          return expect(wait.done).toBeTruthy();
        });
      });
    });
  });

}).call(this);

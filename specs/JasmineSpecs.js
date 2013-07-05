(function() {
  require(['Tween', 'Easing'], function(Tween, Easing) {
    return describe("@tween", function() {
      beforeEach(function() {
        this.startingValue = 12;
        this.target = {
          foo: this.startingValue
        };
        return this.tween = new Tween({
          targets: [this.target],
          property: "foo",
          from: 1,
          to: 10,
          duration: 1000
        });
      });
      describe('#constructor', function() {
        it("should set the property to the from value", function() {
          return expect(this.target.foo).toEqual(this.tween.from);
        });
        it("should not be done", function() {
          return expect(this.tween.done).toBe(false);
        });
        return it("should default to linearTwean for easing", function() {
          return expect(this.tween.easeFunc).toBe(Easing.linearTween);
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
          var target, tween;
          target = {
            foo: {
              bar: 1
            }
          };
          tween = new Tween({
            targets: [target],
            property: 'foo.bar',
            from: 3,
            to: 5,
            duration: 1000
          });
          expect(target.foo.bar).toBe(3);
          tween.update(tween.duration + 10);
          return expect(target.foo.bar).toBe(5);
        });
        it("should update each element of the array", function() {
          var originalValue, target, tween;
          originalValue = [1, 2, 3];
          target = {
            foo: originalValue
          };
          tween = new Tween({
            targets: [target],
            property: 'foo',
            from: [0, 0, 0],
            to: [4, 5, 6],
            duration: 1000
          });
          expect(originalValue[0]).toBe(1);
          expect(originalValue[1]).toBe(2);
          expect(originalValue[2]).toBe(3);
          expect(target.foo[0]).toBe(0);
          expect(target.foo[1]).toBe(0);
          expect(target.foo[2]).toBe(0);
          tween.update(tween.duration + 10);
          expect(target.foo[0]).toBe(4);
          expect(target.foo[1]).toBe(5);
          expect(target.foo[2]).toBe(6);
          expect(originalValue[0]).toBe(1);
          expect(originalValue[1]).toBe(2);
          return expect(originalValue[2]).toBe(3);
        });
        describe("once finished", function() {
          it("should indicate it is done", function() {
            this.tween.update(this.tween.duration + 10);
            return expect(this.tween.done).toBeTruthy();
          });
          it("should set the property to the to value", function() {
            this.tween.update(this.tween.duration + 10);
            return expect(this.target.foo).toEqual(this.tween.to);
          });
          it("should reset to the original value if @restoreAfter is set", function() {
            this.tween.restoreAfter = true;
            this.tween.update(this.tween.duration / 2);
            expect(this.target.foo).not.toEqual(this.tween.to);
            expect(this.tween.done).toBeFalsy();
            this.tween.update(this.tween.duration + 10);
            expect(this.target.foo).toEqual(this.startingValue);
            return expect(this.tween.done).toBeTruthy();
          });
          return it("shouldn't leave behind and temporary properties", function() {
            this.tween.update(this.tween.duration + 10);
            return expect(this.target).toEqual({
              foo: 10
            });
          });
        });
        return describe('easing functions', function() {
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
          return it("should use the specified easing function", function() {
            var tween;
            tween = new Tween({
              targets: [this.target],
              property: "foo",
              easing: this.easingFunc,
              from: 1,
              to: 10,
              duration: 2000
            });
            tween.update(100);
            return expect(this.target.foo).toEqual(this.easedValue);
          });
        });
      });
    });
  });

}).call(this);

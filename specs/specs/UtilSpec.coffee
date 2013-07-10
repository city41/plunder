require ["Util"], (U) ->
  describe "Util", ->

    describe "#toArray", ->
      it "should pass arrays through", ->
        a = [1,2,3]
        b = U.toArray(a)

        expect(b).toBe a

      it "should wrap non arrays into an array", ->
        expect(U.toArray(12)).toEqual [12]

      it "should convert null into an empty array", ->
        expect(U.toArray(null)).toEqual []

      it "should convert undefined into an empty array", ->
        expect(U.toArray()).toEqual []

    describe "#degreesToRadians", ->
      it "should convert to radians", ->
        expect(U.degreesToRadians(180)).toEqual Math.PI
        expect(U.degreesToRadians(360)).toEqual 2*Math.PI
        expect(U.degreesToRadians(0)).toEqual 0
        expect(U.degreesToRadians(100)).toEqual 100 * Math.PI / 180

    describe "#radiansToDegrees", ->
      it "should convert to degrees", ->
        expect(U.radiansToDegrees(Math.PI)).toEqual 180
        expect(U.radiansToDegrees(2*Math.PI)).toEqual 360
        expect(U.radiansToDegrees(100)).toEqual 100 * 180 / Math.PI

    describe "#isNumber", ->
      it "should say an integer is a number", ->
        expect(U.isNumber(81)).toBeTruthy()

      it "should say a float is a number", ->
        expect(U.isNumber(12.344)).toBeTruthy()

      it "should not say non numbers are numbers", ->
        expect(U.isNumber()).toBeFalsy()
        expect(U.isNumber("hello")).toBeFalsy()
        expect(U.isNumber({})).toBeFalsy()
        expect(U.isNumber(null)).toBeFalsy()

    describe "#isFunction", ->
      it "should say a function is a function", ->
        expect(U.isFunction(->)).toBeTruthy()
        fn = ->
        expect(U.isFunction(fn)).toBeTruthy()
        obj = foo: ->
        expect(U.isFunction(obj.foo)).toBeTruthy()

      it "should say non functions are not functions", ->
        expect(U.isFunction()).toBeFalsy()
        expect(U.isFunction(12)).toBeFalsy()
        expect(U.isFunction({})).toBeFalsy()
        expect(U.isFunction(null)).toBeFalsy()
        expect(U.isFunction("foo")).toBeFalsy()
  
    describe "#isUndefined", ->
      it "should say undefined is undefined", ->
        expect(U.isUndefined(undefined)).toBeTruthy()
        expect(U.isUndefined()).toBeTruthy()

      it "should say defined things are not undefined", ->
        expect(U.isUndefined({})).toBeFalsy()
        expect(U.isUndefined(12)).toBeFalsy()
        expect(U.isUndefined(->)).toBeFalsy()
        expect(U.isUndefined("hello")).toBeFalsy()

    describe "#areSameTypes", ->
      it "should indicate arrays are the same type", ->
        expect(U.areSameTypes([], [1, "foo"])).toBeTruthy()

      it "should indicate numbers are the same type", ->
        expect(U.areSameTypes(88, 123.44)).toBeTruthy()

      it "should indicate strings are the same type", ->
        expect(U.areSameTypes("hello", "george")).toBeTruthy()

      it "should say null and an object are the same type", ->
        expect(U.areSameTypes(null, {})).toBeTruthy()

      it "should not say different types are the same", ->
        expect(U.areSameTypes(null, undefined)).toBeFalsy()
        expect(U.areSameTypes("foo", 12)).toBeFalsy()
        expect(U.areSameTypes({}, ->)).toBeFalsy()

    describe "#isArray", ->
      it "should say its an array", ->
        expect(U.isArray([])).toBeTruthy()
        expect(U.isArray([1,2,3])).toBeTruthy()

        obj = foo: [8,9]
        expect(U.isArray(obj.foo)).toBeTruthy()

      it "should say non arrays are not arrays", ->
        expect(U.isArray()).toBeFalsy()
        expect(U.isArray(12)).toBeFalsy()
        expect(U.isArray("not an array")).toBeFalsy()
        expect(U.isArray({})).toBeFalsy()
        expect(U.isArray({"0": 1, "1": 8, "2": 5})).toBeFalsy()

    describe "#isEmpty", ->
      it "should say an empty array is empty", ->
        expect(U.isEmpty([])).toBeTruthy()

      it "should say a non empty array is not empty", ->
        expect(U.isEmpty([1,2,3])).toBeFalsy()

    describe "#any", ->
      it "should return true if array is not empty", ->
        expect(U.any([1])).toBeTruthy()

      it "should return falsy if array is empty", ->
        expect(U.any([])).toBeFalsy()

      it "should return falsy if array is not defined", ->
        expect(U.any(null)).toBeFalsy()
        expect(U.any()).toBeFalsy()

    describe "#first", ->
      it "should return the first element", ->
        expect(U.first([1,2,3])).toBe 1

      it "should return undefined if the array is empty", ->
        expect(U.first([])).toBeUndefined()

    describe "#last", ->
      it "should return the last element", ->
        expect(U.last([1,2,3])).toBe 3

      it "should return undefined if the array is empty", ->
        expect(U.last([])).toBeUndefined()

    describe "#extend", ->
      it "should extend an object", ->
        obj = {}
        incoming =
          foo: 1
          bar: 2

        U.extend(obj, incoming)
        expect(obj.foo).toEqual 1
        expect(obj.bar).toEqual 2

      it "should quietly ignore null destinations", ->
        fn = ->
          U.extend(null, foo: 1)

        expect(fn).not.toThrow()

      it "should quietly ignore undefined destinations", ->
        fn = ->
          U.extend(undefined, foo: 1)

        expect(fn).not.toThrow()

      it "should only apply immediate keys", ->
        obj = {}

        class Foo
          bar: 1
          buz: 2

        source = new Foo()
        source.hi = 8
        source.woah = 9

        U.extend(obj, source)

        expect(obj.hi).toEqual 8
        expect(obj.woah).toEqual 9
        expect(obj.bar).toBeUndefined()
        expect(obj.buz).toBeUndefined()

    describe "#clone", ->
      it "should quietly return for non defined args", ->
        expect(U.clone()).toBeUndefined()
        expect(U.clone(null)).toBe(null)

      it "should return primitives", ->
        expect(U.clone(12)).toBe 12
        expect(U.clone("hello")).toBe "hello"
        expect(U.clone(false)).toBe false
        expect(U.clone(true)).toBe true

      it "should clone an array", ->
        a = [1,2,3]
        b = U.clone(a)

        expect(b).not.toBe a
        expect(b).toEqual a

      it "should clone an object", ->
        obj = 
          foo: 1
          bar: 2

        clone = U.clone(obj)

        expect(clone).not.toBe obj
        expect(clone).toEqual obj




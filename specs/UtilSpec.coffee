require ['Util'], (U) ->
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
        expect(U.isArray({'0': 1, '1': 8, '2': 5})).toBeFalsy()

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




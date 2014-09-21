U = require('../../src/Util')

describe "Util", ->
  describe "#toArray", ->
    it "should pass arrays through", ->
      a = [1,2,3]
      b = U.toArray(a)

      expect(b).to.eql(a)

    it "should wrap non arrays into an array", ->
      expect(U.toArray(12)).to.eql([12])

    it "should convert null into an empty array", ->
      expect(U.toArray(null)).to.eql([])

    it "should convert undefined into an empty array", ->
      expect(U.toArray()).to.eql([])

  describe "#degreesToRadians", ->
    it "should convert to radians", ->
      expect(U.degreesToRadians(180)).to.eql(Math.PI)
      expect(U.degreesToRadians(360)).to.eql(2*Math.PI)
      expect(U.degreesToRadians(0)).to.eql(0)
      expect(U.degreesToRadians(100)).to.eql(100 * Math.PI / 180)

  describe "#radiansToDegrees", ->
    it "should convert to degrees", ->
      expect(U.radiansToDegrees(Math.PI)).to.eql(180)
      expect(U.radiansToDegrees(2*Math.PI)).to.eql(360)
      expect(U.radiansToDegrees(100)).to.eql(100 * 180 / Math.PI)

  describe "#isString", ->
    it "should say a string is a string", ->
      expect(U.isString("im a string")).to.be.true
      expect(U.isString("")).to.be.true
      expect(U.isString(String(4))).to.be.true
      expect(U.isString((2).toString())).to.be.true

    it "should say non strings are not a string", ->
      expect(U.isString()).to.be.false
      expect(U.isString({})).to.be.false
      expect(U.isString([])).to.be.false
      expect(U.isString(null)).to.be.false
      expect(U.isString(false)).to.be.false
      expect(U.isString(true)).to.be.false
      expect(U.isString(undefined)).to.be.false
      expect(U.isString(3)).to.be.false
      expect(U.isString(3.14)).to.be.false

  describe "#isNumber", ->
    it "should say an integer is a number", ->
      expect(U.isNumber(81)).to.be.true

    it "should say a float is a number", ->
      expect(U.isNumber(12.344)).to.be.true

    it "should not say non numbers are numbers", ->
      expect(U.isNumber()).to.be.false
      expect(U.isNumber("hello")).to.be.false
      expect(U.isNumber({})).to.be.false
      expect(U.isNumber(null)).to.be.false

  describe "#isFunction", ->
    it "should say a function is a function", ->
      expect(U.isFunction(->)).to.be.true
      fn = ->
      expect(U.isFunction(fn)).to.be.true
      obj = foo: ->
      expect(U.isFunction(obj.foo)).to.be.true

    it "should say non functions are not functions", ->
      expect(U.isFunction()).to.be.false
      expect(U.isFunction(12)).to.be.false
      expect(U.isFunction({})).to.be.false
      expect(U.isFunction(null)).to.be.false
      expect(U.isFunction("foo")).to.be.false

  describe "#isUndefined", ->
    it "should say undefined is undefined", ->
      expect(U.isUndefined(undefined)).to.be.true
      expect(U.isUndefined()).to.be.true

    it "should say defined things are not undefined", ->
      expect(U.isUndefined({})).to.be.false
      expect(U.isUndefined(12)).to.be.false
      expect(U.isUndefined(->)).to.be.false
      expect(U.isUndefined("hello")).to.be.false

  describe "#areSameTypes", ->
    it "should indicate arrays are the same type", ->
      expect(U.areSameTypes([], [1, "foo"])).to.be.true

    it "should indicate numbers are the same type", ->
      expect(U.areSameTypes(88, 123.44)).to.be.true

    it "should indicate strings are the same type", ->
      expect(U.areSameTypes("hello", "george")).to.be.true

    it "should say null and an object are the same type", ->
      expect(U.areSameTypes(null, {})).to.be.true

    it "should not say different types are the same", ->
      expect(U.areSameTypes(null, undefined)).to.be.false
      expect(U.areSameTypes("foo", 12)).to.be.false
      expect(U.areSameTypes({}, ->)).to.be.false

  describe "#isArray", ->
    it "should say its an array", ->
      expect(U.isArray([])).to.be.true
      expect(U.isArray([1,2,3])).to.be.true

      obj = foo: [8,9]
      expect(U.isArray(obj.foo)).to.be.true

    it "should say non arrays are not arrays", ->
      expect(U.isArray()).to.be.false
      expect(U.isArray(12)).to.be.false
      expect(U.isArray("not an array")).to.be.false
      expect(U.isArray({})).to.be.false
      expect(U.isArray({"0": 1, "1": 8, "2": 5})).to.be.false

  describe "#isEmpty", ->
    it "should say an empty array is empty", ->
      expect(U.isEmpty([])).to.be.true

    it "should say a non empty array is not empty", ->
      expect(U.isEmpty([1,2,3])).to.be.false

  describe "#any", ->
    it "should return true if array is not empty", ->
      expect(U.any([1])).to.be.true

    it "should return false if array is empty", ->
      expect(U.any([])).to.be.false

    it "should return false if array is not defined", ->
      expect(U.any(null)).to.be.false
      expect(U.any()).to.be.false

  describe "#first", ->
    it "should return the first element", ->
      expect(U.first([1,2,3])).to.eql(1)

    it "should return undefined if the array is empty", ->
      expect(U.first([])).to.be.undefined

  describe "#last", ->
    it "should return the last element", ->
      expect(U.last([1,2,3])).to.eql(3)

    it "should return undefined if the array is empty", ->
      expect(U.last([])).to.be.undefined

  describe "#extend", ->
    it "should extend an object", ->
      obj = {}
      incoming =
        foo: 1
        bar: 2

      U.extend(obj, incoming)
      expect(obj.foo).to.eql(1)
      expect(obj.bar).to.eql(2)

    it "should quietly ignore null destinations", ->
      fn = ->
        U.extend(null, foo: 1)

      expect(fn).not.to.throw(Error)

    it "should quietly ignore undefined destinations", ->
      fn = ->
        U.extend(undefined, foo: 1)

      expect(fn).not.to.throw(Error)

    it "should only apply immediate keys", ->
      obj = {}

      class Foo
        bar: 1
        buz: 2

      source = new Foo()
      source.hi = 8
      source.woah = 9

      U.extend(obj, source)

      expect(obj.hi).to.eql(8)
      expect(obj.woah).to.eql(9)
      expect(obj.bar).to.be.undefined
      expect(obj.buz).to.be.undefined

  describe "#clone", ->
    it "should quietly return for non defined args", ->
      expect(U.clone()).to.be.undefined
      expect(U.clone(null)).to.be.null

    it "should return primitives", ->
      expect(U.clone(12)).to.eql(12)
      expect(U.clone("hello")).to.eql("hello")
      expect(U.clone(false)).to.eql(false)
      expect(U.clone(true)).to.eql(true)

    it "should clone an array", ->
      a = [1,2,3]
      b = U.clone(a)

      expect(b == a).to.be.false
      expect(b).to.eql(a)

    it "should clone an object", ->
      obj =
        foo: 1
        bar: 2

      clone = U.clone(obj)

      expect(clone == obj).to.be.false
      expect(clone).to.eql(obj)

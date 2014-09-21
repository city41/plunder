Accessor = require('../../src/Accessor')

describe "Accessor", ->
  beforeEach ->
    @obj =
      nested:
        three:
          down: 3
      first: 1

  describe "#get", ->
    it "should get immediate properties", ->
      accessor = new Accessor(@obj, "first")
      expect(accessor.get()).to.eql(1)

    it "should quietly return non-existant immediate properties", ->
      accessor = new Accessor(@obj, "doesntexist")
      expect(accessor.get()).to.be.undefined

    it "should return nested properties", ->
      accessor = new Accessor(@obj, "nested.three.down")
      expect(accessor.get()).to.eql(3)

    it "should quietly return non-existant nested properties", ->
      accessor = new Accessor(@obj, "nested.nope")
      expect(accessor.get()).to.be.undefined

  describe "#set", ->
    it "should set immediate properties", ->
      accessor = new Accessor(@obj, "first")
      accessor.set(2)
      expect(@obj.first).to.eql(2)

    it "should set non-existant immediate properties", ->
      accessor = new Accessor(@obj, "nope")
      accessor.set(4)
      expect(@obj.nope).to.eql(4)

    it "should set non-existant nested properties on the leaf object", ->
      accessor = new Accessor(@obj, "nested.three.nope")
      accessor.set(5)
      expect(@obj.nested.three.nope).to.eql(5)

    it "should set non-existant nested properties on new subobjects", ->
      accessor = new Accessor(@obj, "nested.nope.not")
      accessor.set(6)
      expect(@obj.nested.nope.not).to.eql(6)

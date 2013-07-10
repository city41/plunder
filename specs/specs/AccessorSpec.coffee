require ["Accessor"], (Accessor) ->
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
        expect(accessor.get()).toBe 1

      it "should quietly return non-existant immediate properties", ->
        accessor = new Accessor(@obj, "doesntexist")
        expect(accessor.get()).toBeUndefined()

      it "should return nested properties", ->
        accessor = new Accessor(@obj, "nested.three.down")
        expect(accessor.get()).toBe 3
        
      it "should quietly return non-existant nested properties", ->
        accessor = new Accessor(@obj, "nested.nope")
        expect(accessor.get()).toBeUndefined()

    describe "#set", ->
      it "should set immediate properties", ->
        accessor = new Accessor(@obj, "first")
        accessor.set(2);
        expect(@obj.first).toBe 2

      it "should set non-existant immediate properties", ->
        accessor = new Accessor(@obj, "nope")
        accessor.set(4)
        expect(@obj.nope).toBe 4

      it "should set non-existant nested properties on the leaf object", ->
        accessor = new Accessor(@obj, "nested.three.nope")
        accessor.set(5)
        expect(@obj.nested.three.nope).toBe 5

      it "should set non-existant nested properties on new subobjects", ->
        accessor = new Accessor(@obj, "nested.nope.not")
        accessor.set(6)
        expect(@obj.nested.nope.not).toBe 6

    describe "#del", ->
      it "should delete immediate properties", ->
        accessor = new Accessor(@obj, "first")
        accessor.del()
        expect(@obj).not.toHaveProperty("first")
        expect(@obj).toHaveProperty("nested")

      it "should delete nested properties", ->
        accessor = new Accessor(@obj, "nested.three")
        accessor.del()
        expect(@obj.nested).not.toHaveProperty("three")

      it "should quietly ignore non-existant paths", ->
        accessor = new Accessor(@obj, "nested.nope.not")
        fn = ->
          accessor.del()

        expect(fn).not.toThrow()



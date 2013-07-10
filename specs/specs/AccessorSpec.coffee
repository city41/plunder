require ["Accessor"], (A) ->
  describe "Accessor", ->
    beforeEach ->
      @obj =
        nested:
          three:
            down: 3
        first: 1

    describe "#getProperty", ->
      it "should get immediate properties", ->
        expect(A.getProperty(@obj, "first")).toBe 1

      it "should quietly return non-existant immediate properties", ->
        expect(A.getProperty(@obj, "doesntexist")).toBeUndefined()

      it "should return nested properties", ->
        expect(A.getProperty(@obj, "nested.three.down")).toBe 3
        
      it "should quietly return non-existant nested properties", ->
        expect(A.getProperty(@obj, "nested.nope")).toBeUndefined()

    describe "#setProperty", ->
      it "should set immediate properties", ->
        A.setProperty(@obj, "first", 2)
        expect(@obj.first).toBe 2

      it "should set non-existant immediate properties", ->
        A.setProperty(@obj, "nope", 4)
        expect(@obj.nope).toBe 4

      it "should set non-existant nested properties on the leaf object", ->
        A.setProperty(@obj, "nested.three.nope", 5)
        expect(@obj.nested.three.nope).toBe 5

      it "should set non-existant nested properties on new subobjects", ->
        A.setProperty(@obj, "nested.nope.not", 6)
        expect(@obj.nested.nope.not).toBe 6

    describe "#deleteProperty", ->
      it "should delete immediate properties", ->
        A.deleteProperty(@obj, "first")
        expect(@obj).not.toHaveProperty("first")
        expect(@obj).toHaveProperty("nested")

      it "should delete nested properties", ->
        A.deleteProperty(@obj, "nested.three")
        expect(@obj.nested).not.toHaveProperty("three")

      it "should quietly ignore non-existant paths", ->
        fn = =>
          A.deleteProperty(@obj, "nested.nope.not")
        expect(fn).not.toThrow()



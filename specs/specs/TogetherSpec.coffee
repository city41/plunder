require ["Together"], (Together) ->
  describe "Together", ->
    getChild = ->
      reset: ->
      update: ->
      reverse: ->

    beforeEach ->
      @children = [getChild(), getChild(), getChild()]
      @together = new Together()
      @together.children = @children

    describe "#reset", ->
      it "should reset all its children", ->
        for child in @children
          spyOn child, "reset"

        @together.reset()
        for child in @children
          expect(child.reset).toHaveBeenCalled()


    describe "#update", ->
      it "should update all its children", ->
        for child in @children
          spyOn child, "update"

        @together.update()
        for child in @children
          expect(child.update).toHaveBeenCalled()


      it "should report its done if all its children are done", ->
        for child in @children
          child.done = true

        @together.update()
        expect(@together.done).toBeTruthy()

      it "should not report its done if all its @children are not done", ->
        for child in @children
          child.done = true

        @children[1].done = false
        @together.update()
        expect(@together.done).toBeFalsy()

    describe "#reverse", ->
      it "should not be the same animation", ->
        reversed = @together.reverse()
        expect(reversed).not.toBe @together

      it "should call reverse() on all its children", ->
        for child in @children
          spyOn child, "reverse"

        @together.reverse()

        for child in @children
          expect(child.reverse).toHaveBeenCalled()



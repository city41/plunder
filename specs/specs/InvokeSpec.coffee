require ['Invoke'], (Invoke) ->
  describe "Invoke", ->
    describe "#update", ->
      it "should invoke the provided function", ->
        obj = func: ->

        spyOn obj, "func"
        invoke = new Invoke(func: obj.func)
        invoke.update()
        expect(obj.func).toHaveBeenCalled()
        expect(invoke.done).toBe true

    describe "#reset", ->
      it "should reset", ->
        invoke = new Invoke(func: ->)
        invoke.done = true

        invoke.reset()
        expect(invoke.done).toBe false

    describe "#reverse", ->
      beforeEach ->
        @invoke = new Invoke
          func: ->
          context: {}

        @reversed = @invoke.reverse()

      it "should be a different animation", ->
        expect(@reversed).not.toBe @invoke

      it "should have the same function", ->
        expect(@reversed.func).toBe @invoke.func

      it "should have the same context", ->
        expect(@reversed.context).toBe @invoke.context


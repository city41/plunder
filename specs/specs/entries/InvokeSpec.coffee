require ['Invoke'], (Invoke) ->
  describe "Invoke", ->
    it "should invoke the provided function", ->
      obj = func: ->

      spyOn obj, "func"
      invoke = new Invoke(func: obj.func)
      invoke.update()
      expect(obj.func).toHaveBeenCalled()
      expect(invoke.done).toBe true

    it "should reset", ->
      invoke = new Invoke(func: ->)
      invoke.done = true

      invoke.reset()
      expect(invoke.done).toBe false


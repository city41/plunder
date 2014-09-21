Invoke = require('../../src/Invoke')

describe "Invoke", ->
  describe "#update", ->
    it "should invoke the provided function", ->
      obj = func: ->

      @spy(obj, "func")
      invoke = new Invoke(func: obj.func)
      invoke.update()
      expect(obj.func).to.have.been.called.once
      expect(invoke.done).to.be.true

  describe "#reset", ->
    it "should reset", ->
      invoke = new Invoke(func: ->)
      invoke.done = true

      invoke.reset()
      expect(invoke.done).to.be.false

  describe "#reverse", ->
    beforeEach ->
      @invoke = new Invoke
        func: ->
        context: {}

      @reversed = @invoke.reverse()

    it "should be a different animation", ->
      expect(@reversed == @invoke).to.be.false

    it "should have the same function", ->
      expect(@reversed.func).to.eql(@invoke.func)

    it "should have the same context", ->
      expect(@reversed.context).to.eql(@invoke.context)

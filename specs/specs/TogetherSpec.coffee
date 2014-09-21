Together = require('../../src/Together')


describe "Together", ->
  helpers
    getChild: ->
      reset: @stub()
      update: @stub()
      reverse: @stub()

  beforeEach ->
    @children = [@getChild(), @getChild(), @getChild()]
    @together = new Together()
    @together.children = @children

  describe "#reset", ->
    it "should reset all its children", ->
      @together.reset()
      for child in @children
        expect(child.reset).to.have.been.calledOnce


  describe "#update", ->
    it "should update all its children", ->
      @together.update()
      for child in @children
        expect(child.update).to.have.been.calledOnce


    it "should report its done if all its children are done", ->
      for child in @children
        child.done = true

      @together.update()
      expect(@together.done).to.be.true

    it "should not report its done if all its @children are not done", ->
      for child in @children
        child.done = true

      @children[1].done = false
      @together.update()
      expect(@together.done).to.be.false

  describe "#reverse", ->
    it "should not be the same animation", ->
      reversed = @together.reverse()
      expect(reversed == @together).to.be.false

    it "should call reverse() on all its children", ->
      @together.reverse()

      for child in @children
        expect(child.reverse).to.have.been.calledOnce

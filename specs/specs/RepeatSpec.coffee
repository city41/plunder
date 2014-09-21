Repeat = require('../../src/Repeat')

describe "Repeat", ->
  helpers
    getChild: ->
      child = {
        update: ->
          @done = true
        reset: @stub()
        reverse: @stub()
      }
      @spy(child, 'update')
      return child

  beforeEach ->
    @children = [@getChild(), @getChild()]

    @repeat = new Repeat(2)
    @repeat.children = @children

  describe "#update", ->
    it "should update the children in sequence", ->
      @repeat.update()
      expect(@children[0].update).to.have.been.calledOnce
      expect(@children[1].update).not.to.have.been.called
      @children[0].update.reset()

      @repeat.update()
      expect(@children[0].update).not.to.have.been.called
      expect(@children[1].update).to.have.been.calledOnce

      for child in @children
        expect(child.reset).to.have.been.called


    it "should repeat the cycle", ->
      @repeat.update()
      expect(@children[0].update).to.have.been.calledOnce
      expect(@children[1].update).not.to.have.been.called

      @repeat.update()
      expect(@children[0].update).to.have.been.calledOnce
      expect(@children[1].update).to.have.been.calledOnce

      @repeat.update()
      expect(@children[0].update).to.have.been.calledTwice
      expect(@children[1].update).to.have.been.calledOnce

      @repeat.update()
      expect(@children[0].update).to.have.been.calledTwice
      expect(@children[1].update).to.have.been.calledTwice

  describe "#reverse", ->
    it "should not be the same animation", ->
      reversed = @repeat.reverse()
      expect(reversed == @repeat).to.be.false

    it "should call reverse() on all its children", ->
      @repeat.reverse()

      for child in @children
        expect(child.reverse).to.have.been.called

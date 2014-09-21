Wait = require('../../src/Wait')

describe "Wait", ->
  helpers
    getWait: ->
      new Wait
        duration: 100

    getMinMaxWait: (min=10, max=20) ->
      new Wait
        min: min
        max: max

  describe "#constructor", ->
    it "should not be done", ->
      wait = @getWait()
      expect(wait.done).to.be.false

    it "should set duration from min and max", ->
      wait = @getMinMaxWait(5, 10)

      expect(wait.duration).to.be.above(4)
      expect(wait.duration).to.be.below(11)

    it "should throw if min is greater than max", ->
      fn = ->
        getMinMaxWait(10, 5)

      expect(fn).to.throw(Error)

  describe "#update", ->
    it "should wait for the specified duration", ->
      wait = @getWait()

      for i in [0...99]
        wait.update(1)
        expect(wait.done).to.be.false

      wait.update(1)
      expect(wait.done).to.be.true

  describe "#reverse", ->
    it "should be a different animation", ->
      wait = @getWait()
      reversed = wait.reverse()

      expect(reversed == wait).to.be.false

    it "should wait the same for a static wait", ->
      wait = @getWait()
      reversed = wait.reverse()

      expect(reversed.min).to.eql(wait.min)
      expect(reversed.max).to.eql(wait.max)
      expect(reversed.duration).to.eql(wait.duration)

    it "should have the same duration for a variable wait", ->
      # ie: it should not reroll a new duration
      wait = @getMinMaxWait()
      reversed = wait.reverse()

      expect(reversed.min).to.be.undefined
      expect(reversed.max).to.be.undefined
      expect(reversed.duration).to.eql(wait.duration)

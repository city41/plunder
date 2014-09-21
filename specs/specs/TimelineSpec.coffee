Timeline = require('../../src/Timeline')
Tween = require('../../src/Tween')
Repeat = require('../../src/Repeat')
Easie = require('../../src/Easie')

describe "Timeline", ->
  getOwner = ->
    anis: [],
    addPlunderAnimation: (ani) ->
      @anis.push(ani)
    clearPlunderAnimations: ->
      @anis = []

  beforeEach ->
    @owner = getOwner()
    @timeline = new Timeline(@owner)

  describe "#constructor", ->
    it "should throw if no owner provided", ->
      fn = ->
        new Timeline()

      expect(fn).to.throw(Error)

      fn = ->
        new Timeline({})

      expect(fn).not.to.throw(Error)

  describe "targets", ->
    it "should use the owner as a target if none specified", ->
      tween = @timeline.tween
        property: 'x'

      expect(tween.targets[0]).to.eql(@owner)

    it "should convert a singular target into targets", ->
      target = {}
      tween = @timeline.tween
        target: target
        property: 'x'

      expect(tween.targets[0]).to.eql(target)

    it "target should support an array of targets", ->
      targets = [{}, {}]
      tween = @timeline.tween
        target: targets
        property: 'x'

      expect(tween.targets[0]).to.eql(targets[0])
      expect(tween.targets[1]).to.eql(targets[1])

  describe "creating anis", ->
    it "should add the ani to the owner", ->
      tween = @timeline.tween
        property: 'x'

      expect(tween).to.be.an.instanceOf(Tween)
      expect(tween).to.eql(@owner.anis[0])

  describe "#move", ->
    it "should translate x/y correctly", ->
      move = @timeline.move
        from: x: 10, y: 20
        to: x: 100, y: 200
        duration: 999

      expect(move.children[0].property).to.eql('x')
      expect(move.children[0].from).to.eql(10)
      expect(move.children[0].to).to.eql(100)

      expect(move.children[1].property).to.eql('y')
      expect(move.children[1].from).to.eql(20)
      expect(move.children[1].to).to.eql(200)

    it "should have the specified duration", ->
      move = @timeline.move
        from: x: 10, y: 10
        to: x: 20, y: 20
        duration: 999

      expect(move.children[0].duration).to.eql(999)
      expect(move.children[1].duration).to.eql(999)

    it "should have the specified easing", ->
      move = @timeline.move
        from: x: 10, y: 20
        to: x: 100, y: 200
        easing: 'quadInOut'

      expect(move.children[0].easeFunc).to.eql(Easie.quadInOut)
      expect(move.children[1].easeFunc).to.eql(Easie.quadInOut)

    it "should translate easingX", ->
      move = @timeline.move
        from: x: 10, y: 20
        to: x: 100, y: 200
        easingX: 'quadInOut'

      expect(move.children[0].easeFunc).to.eql(Easie.quadInOut)
      expect(move.children[1].easeFunc).to.eql(Easie.linear)

    it "should translate easingY", ->
      move = @timeline.move
        from: x: 10, y: 20
        to: x: 100, y: 200
        easingY: 'quadInOut'

      expect(move.children[0].easeFunc).to.eql(Easie.linear)
      expect(move.children[1].easeFunc).to.eql(Easie.quadInOut)

  describe "#scale", ->
    it "should specify the scale property", ->
      scale = @timeline.scale()
      expect(scale.property).to.eql('scale')

    it "should set the from and to properties", ->
      scale = @timeline.scale from: 1, to: 10
      expect(scale.from).to.eql(1)
      expect(scale.to).to.eql(10)

    it "should set the duration", ->
      scale = @timeline.scale duration: 1000
      expect(scale.duration).to.eql(1000)

  describe "#color", ->
    it "should specify the color property", ->
      color = @timeline.color()
      expect(color.property).to.eql("color")

    it "should set the duration", ->
      color = @timeline.color duration: 123
      expect(color.duration).to.eql(123)

  describe "#rotate", ->
    it "should specify the angle property", ->
      rotate = @timeline.rotate()
      expect(rotate.property).to.eql("angle")

    it "should set the duration", ->
      rotate = @timeline.rotate duration: 10
      expect(rotate.duration).to.eql(10)

  describe "#wait", ->
    it "should set min and max to be the same", ->
      wait = @timeline.wait 500
      expect(wait.min).to.eql(500)
      expect(wait.max).to.eql(500)

  describe "#waitBetween", ->
    beforeEach ->
      @wait = @timeline.waitBetween 5, 10

    it "should set min", ->
      expect(@wait.min).to.eql(5)

    it "should set max", ->
      expect(@wait.max).to.eql(10)

  describe "#reverse", ->
    it "should reverse the tween", ->
      tween = @timeline.tween
        from: 8
        to: 4
        duration: 1000
        property: 'x'
        easing: 'cubicIn'

      reversed = @timeline.reverse(tween)

      expect(reversed.from).to.eql(tween.to)
      expect(reversed.to).to.eql(tween.from)
      expect(reversed.duration).to.eql(tween.duration)
      expect(reversed.property).to.eql(tween.property)
      expect(reversed.easing).to.eql('cubicOut')

  describe "#together", ->
    it "should pass the default config down to children", ->
      together = @timeline.together duration: 123, =>
        @timeline.tween
          property: 'x'
        @timeline.rotate()

      expect(together.children[0].duration).to.eql(123)
      expect(together.children[1].duration).to.eql(123)

    it "should let children override the default config", ->
      together = @timeline.together duration: 123, =>
        @timeline.tween
          property: 'x'
          duration: 456
        @timeline.rotate()

      expect(together.children[0].duration).to.eql(456)
      expect(together.children[1].duration).to.eql(123)


    it "should work without a default config", ->
      together = @timeline.together =>
        @timeline.tween
          property: 'x'
          duration: 80
        @timeline.rotate
          duration: 123

      expect(together.children[0].duration).to.eql(80)
      expect(together.children[1].duration).to.eql(123)

  describe "#repeat", ->
    it "should set the number of times to repeat", ->
      repeat = @timeline.repeat 3, ->
      expect(repeat.count).to.eql(3)

    it "should pass the default config down to children", ->
      repeat = @timeline.repeat 2, duration: 123, =>
        @timeline.tween
          property: 'x'
        @timeline.rotate()

      expect(repeat.children[0].duration).to.eql(123)
      expect(repeat.children[1].duration).to.eql(123)

    it "should let children override the default config", ->
      repeat = @timeline.repeat 2, duration: 123, =>
        @timeline.tween
          property: 'x'
          duration: 456
        @timeline.rotate()

      expect(repeat.children[0].duration).to.eql(456)
      expect(repeat.children[1].duration).to.eql(123)

    it "should work without a default config", ->
      repeat = @timeline.repeat 2, =>
        @timeline.tween
          property: 'x'
          duration: 80
        @timeline.rotate
          duration: 123

      expect(repeat.children[0].duration).to.eql(80)
      expect(repeat.children[1].duration).to.eql(123)

  describe "#forever", ->
    it "should be a Repeat with count of Infinity", ->
      forever = @timeline.forever ->
      expect(forever).to.be.an.instanceOf(Repeat)
      expect(forever.count).to.eql(Infinity)

  describe "#sequence", ->
    it "should be a Repeat with count of 1", ->
      sequence = @timeline.sequence ->
      expect(sequence).to.be.an.instanceOf(Repeat)
      expect(sequence.count).to.eql(1)

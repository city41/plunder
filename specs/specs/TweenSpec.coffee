Tween = require('../../src/Tween')
Easie = require('../../src/Easie')

describe "Tween", ->
  helpers
    getTween: (options = {}, initial, from, to) ->
      target = options.target ? { foo: initial }
      property = options.property ? 'foo'

      tween = new Tween
        targets: [target]
        property: property
        from: from
        to: to
        duration: 1000
        easing: options.easing

      return { tween, target }

    getNumericTween: (options, initial=12) ->
      @getTween(options, initial, 1, 10)

    getArrayTween: (options, initial=[0,0,0]) ->
      @getTween(options, initial, [1,2,3], [4,5,6])

    getNoFromTween: (options) ->
      @getTween(options, 12, undefined, 10)

  describe '#constructor', ->
    it "should not set the property to the from value", ->
      # initting targets during the constructor is bad when more than one
      # tween is involved in an animation, they end up clobbering each other
      initial = 88
      { tween, target } = @getNumericTween({}, initial)
      expect(target.foo).to.eql(initial)

    it "should not be done", ->
      { tween, target } = @getNumericTween()
      expect(tween.done).to.be.false

    it "should default to linearfor easing", ->
      { tween, target } = @getNumericTween()
      expect(tween.easeFunc).to.eql(Easie.linear)

  describe '#update', ->
    it "should tween all targets", ->
      targets = [{}, {}, {}]

      fromValue = 23

      tween = new Tween
        targets: targets
        property: "foo"
        from: fromValue
        to: 2000
        duration: 1000

      tween.update 0

      for target in targets
        expect(target.foo).to.eql(fromValue)

    it "should update nested properties", ->
      { tween, target } = @getNumericTween
        target:
          foo:
            bar: 1
        property: 'foo.bar'

      expect(target.foo.bar).to.eql(1)
      tween.update(tween.duration + 10)
      expect(target.foo.bar).to.eql(10)

    it "should update each element of the array", ->
      originalValue = [12,13,14]
      { tween, target } = @getArrayTween({}, originalValue)

      tween.update(tween.duration + 10)

      # original array should be untouched
      expect(originalValue[0]).to.eql(12)
      expect(originalValue[1]).to.eql(13)
      expect(originalValue[2]).to.eql(14)

      expect(target.foo[0]).to.eql(4)
      expect(target.foo[1]).to.eql(5)
      expect(target.foo[2]).to.eql(6)

    describe "once finished", ->
      it "should indicate it is done", ->
        { tween, target } = @getNumericTween()
        tween.update tween.duration + 10
        expect(tween.done).to.be.true

      it "should set the property to the to value", ->
        { tween, target } = @getNumericTween()
        tween.update tween.duration + 10
        expect(target.foo).to.eql(tween.to)

      it "should reset to the original value if @restoreAfter is set", ->
        { tween, target } = @getNumericTween()
        tween.restoreAfter = true
        tween.update tween.duration / 2
        expect(target.foo).not.to.eql(tween.to)
        expect(tween.done).to.be.false

        tween.update tween.duration + 10
        expect(target.foo).to.eql(12)
        expect(tween.done).to.be.true

      it "shouldn't leave behind and temporary properties", ->
        { tween, target } = @getNumericTween()
        tween.update tween.duration + 10
        expect(target).to.eql({ foo: 10 })

    describe "tweening", ->
      beforeEach ->
        @easingFunc = 'testEasieFunc'
        @easedValue = 12
        Easie[@easingFunc] = => @easedValue

      afterEach ->
        delete Easie[@easingFunc]

      it "should tween values", ->
        { tween, target } = @getNumericTween
          easing: @easingFunc

        tween.update 100
        expect(target.foo).to.eql(@easedValue)

      it "should tween arrays", ->
        { tween, target } = @getArrayTween
          easing: @easingFunc

        tween.update 100

        expect(target.foo[0]).to.eql(@easedValue)
        expect(target.foo[1]).to.eql(@easedValue)
        expect(target.foo[2]).to.eql(@easedValue)

      it "should not require from", ->
        { tween, target } = @getNoFromTween
          easing: @easingFunc

        tween.update 100

        expect(target.foo).to.eql(@easedValue)

    describe '#reset', ->
      it 'should not change the property', ->
        { tween, target } = @getNumericTween()

        tween.update(tween.duration + 10)
        beforeResetValue = target.foo

        tween.reset()

        expect(target.foo).to.eql(beforeResetValue)

      it 'should change the target upon updating', ->
        { tween, target } = @getNumericTween()

        tween.update(tween.duration + 10)
        tween.reset()
        tween.update(0)
        expect(target.foo).to.eql(tween.from)

    describe "#reverse", ->
      it "should reverse the tween", ->
        { tween, target } = @getNumericTween()
        reversed = tween.reverse()

        expect(tween.to).not.to.eql(tween.from)

        expect(reversed.to).to.eql(tween.from)
        expect(reversed.from).to.eql(tween.to)
        expect(reversed.targets).to.eql(tween.targets)
        expect(reversed.duration).to.eql(tween.duration)
        expect(reversed.easeFunc).to.eql(tween.easeFunc)

      it "should reverse the easing", ->
        { tween, target } = @getNumericTween easing: 'quadIn'
        reversed = tween.reverse()

        expect(reversed.easing).to.eql('quadOut')

    describe "error conditions", ->
      it "should throw an error if asked to tween a non numeric value", ->
        target = foo: 'hello'

        tween = new Tween
          targets: [target]
          property: 'foo'
          from: 'not'
          to: 'gonna happen'
          duration: 2000

        fn = ->
          tween.update(10)

        expect(fn).to.throw(Error)

      it "should throw an error if existing property and from are of different types", ->
        target = foo: 1

        tween = new Tween
          targets: [target]
          property: 'foo'
          from: [0,0,0]
          to: [1,1,1]
          duration: 2000

        fn = ->
          tween.update(10)

        expect(fn).to.throw(Error)

      it "should not throw an error if there is no existing property", ->
        target = {}

        tween = new Tween
          targets: [target]
          property: 'foo'
          from: [0,0,0]
          to: [1,1,1]
          duration: 2000

        fn = ->
          tween.update(10)

        expect(fn).not.to.throw(Error)

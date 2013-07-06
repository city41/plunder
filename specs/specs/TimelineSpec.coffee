require ["Timeline", "Tween", "Easing"], (Timeline, Tween, Easing) ->
  describe "Timeline", ->
    getOwner = ->
      {
        anis: [],
        addAni: (ani) ->
          @anis.push(ani)
        clearAnis: ->
          @anis = []
      }

    beforeEach ->
      @owner = getOwner()
      @timeline = new Timeline(@owner)

    describe "#constructor", ->
      it "should throw if no owner provided", ->
        fn = ->
          new Timeline()

        expect(fn).toThrow()

        fn = ->
          new Timeline({})

        expect(fn).not.toThrow()

    describe "targets", ->
      it "should use the owner as a target if none specified", ->
        tween = @timeline.tween
          property: 'x'

        expect(tween.targets[0]).toBe @owner

      it "should convert a singular target into targets", ->
        target = {}
        tween = @timeline.tween
          target: target
          property: 'x'

        expect(tween.targets[0]).toBe target

      it "should use the targets", ->
        targets = [{}, {}]
        tween = @timeline.tween
          targets: targets
          property: 'x'

        expect(tween.targets[0]).toBe targets[0]
        expect(tween.targets[1]).toBe targets[1]

    describe "creating anis", ->
      it "should add the ani to the owner", ->
        tween = @timeline.tween
          property: 'x'

        expect(tween).toBeInstanceOf Tween
        expect(tween).toBe @owner.anis[0]

    describe "#move", ->
      it "should translate x/y correctly", ->
        move = @timeline.move
          from: x: 10, y: 20
          to: x: 100, y: 200
          duration: 999

        expect(move.children[0].property).toBe 'x'
        expect(move.children[0].from).toBe 10
        expect(move.children[0].to).toBe 100

        expect(move.children[1].property).toBe 'y'
        expect(move.children[1].from).toBe 20
        expect(move.children[1].to).toBe 200

      it "should have the specified duration", ->
        move = @timeline.move
          from: x: 10, y: 10
          to: x: 20, y: 20
          duration: 999

        expect(move.children[0].duration).toBe 999
        expect(move.children[1].duration).toBe 999

      it "should have the specified easing", ->
        move = @timeline.move
          from: x: 10, y: 20
          to: x: 100, y: 200
          easing: 'easeInOutQuad'

        expect(move.children[0].easeFunc).toBe Easing.easeInOutQuad
        expect(move.children[1].easeFunc).toBe Easing.easeInOutQuad

      it "should translate easingX", ->
        move = @timeline.move
          from: x: 10, y: 20
          to: x: 100, y: 200
          easingX: 'easeInOutQuad'

        expect(move.children[0].easeFunc).toBe Easing.easeInOutQuad
        expect(move.children[1].easeFunc).toBe Easing.linearTween

      it "should translate easingY", ->
        move = @timeline.move
          from: x: 10, y: 20
          to: x: 100, y: 200
          easingY: 'easeInOutQuad'

        expect(move.children[0].easeFunc).toBe Easing.linearTween
        expect(move.children[1].easeFunc).toBe Easing.easeInOutQuad

    describe "#scale", ->
      it "should specify the scale property", ->
        scale = @timeline.scale()
        expect(scale.property).toBe 'scale'

      it "should set the from and to properties", ->
        scale = @timeline.scale from: 1, to: 10
        expect(scale.from).toBe 1
        expect(scale.to).toBe 10

      it "should set the duration", ->
        scale = @timeline.scale duration: 1000
        expect(scale.duration).toBe 1000

    describe "#color", ->
      it "should specify the color property", ->
        color = @timeline.color()
        expect(color.property).toBe "color"

      it "should default to a 4 element array", ->
        color = @timeline.color()
        expect(color.from).toEqual [0,0,0,0]
        expect(color.to).toEqual [0,0,0,0]
        expect(color.duration).toBe 0

      it "should set the duration", ->
        color = @timeline.color duration: 123
        expect(color.duration).toBe 123

    describe "#rotate", ->
      it "should specify the angle property", ->
        rotate = @timeline.rotate()
        expect(rotate.property).toBe "angle"

      it "should default to a number", ->
        rotate = @timeline.rotate()
        expect(rotate.from).toBe 0
        expect(rotate.to).toBe 0
        expect(rotate.duration).toBe 0

      it "should set the duration", ->
        rotate = @timeline.rotate duration: 10
        expect(rotate.duration).toBe 10

    describe "#wait", ->
      it "should set min and max to be the same", ->
        wait = @timeline.wait 500
        expect(wait.min).toBe 500
        expect(wait.max).toBe 500

    describe "#waitBetween", ->
      beforeEach ->
        @wait = @timeline.waitBetween 5, 10

      it "should set min", ->
        expect(@wait.min).toBe 5

      it "should set max", ->
        expect(@wait.max).toBe 10

      


require ["Timeline", "Tween"], (Timeline, Tween) ->
  describe "Timeline", ->
    getOwner = ->
      {
        anis: [],
        _addAni: (ani) ->
          @anis.push(ani)
        _clearAnis: ->
          @anis = []
      }

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
        owner = getOwner()
        timeline = new Timeline(owner)
        timeline.tween
          property: 'x'

        expect(owner.anis[0].targets[0]).toBe owner

      it "should convert a singular target into targets", ->
        target = {}
        owner = getOwner()
        timeline = new Timeline(owner)
        timeline.tween
          target: target
          property: 'x'

        expect(owner.anis[0].targets[0]).toBe target

      it "should use the targets", ->
        targets = [{}, {}]
        owner = getOwner()
        timeline = new Timeline(owner)
        timeline.tween
          targets: targets
          property: 'x'

        expect(owner.anis[0].targets[0]).toBe targets[0]
        expect(owner.anis[0].targets[1]).toBe targets[1]

    describe "#tween", ->
      it "should build a tween object", ->
        owner = getOwner()
        timeline = new Timeline(owner)
        timeline.tween
          property: 'x'

        expect(owner.anis[0]).toBeInstanceOf Tween
        


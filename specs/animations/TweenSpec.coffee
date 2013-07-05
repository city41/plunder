require ['Tween', 'Easing'], (Tween, Easing) ->
  describe "@tween", ->
    beforeEach ->
      @startingValue = 12
      @target = foo: @startingValue
      @tween = new Tween
        targets: [@target]
        property: "foo"
        from: 1
        to: 10
        duration: 1000

    describe '#constructor', ->
      it "should set the property to the from value", ->
        expect(@target.foo).toEqual @tween.from

      it "should not be done", ->
        expect(@tween.done).toBe false

      it "should default to linearTwean for easing", ->
        expect(@tween.easeFunc).toBe Easing.linearTween

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
          expect(target.foo).toEqual fromValue

      it "should update nested properties", ->
        target = 
          foo:
            bar: 1

        tween = new Tween
          targets: [target]
          property: 'foo.bar'
          from: 3
          to: 5
          duration: 1000

        expect(target.foo.bar).toBe 3
        tween.update(tween.duration + 10)
        expect(target.foo.bar).toBe 5

      it "should update each element of the array", ->
        originalValue = [1,2,3]
        target = 
          foo: originalValue

        tween = new Tween
          targets: [target]
          property: 'foo'
          from: [0,0,0]
          to: [4,5,6]
          duration: 1000

        # original array should be untouched
        expect(originalValue[0]).toBe 1
        expect(originalValue[1]).toBe 2
        expect(originalValue[2]).toBe 3

        expect(target.foo[0]).toBe 0
        expect(target.foo[1]).toBe 0
        expect(target.foo[2]).toBe 0

        tween.update(tween.duration + 10)
        expect(target.foo[0]).toBe 4
        expect(target.foo[1]).toBe 5
        expect(target.foo[2]).toBe 6

        # double check original array is untouched
        expect(originalValue[0]).toBe 1
        expect(originalValue[1]).toBe 2
        expect(originalValue[2]).toBe 3

      describe "once finished", ->
        it "should indicate it is done", ->
          @tween.update @tween.duration + 10
          expect(@tween.done).toBeTruthy()

        it "should set the property to the to value", ->
          @tween.update @tween.duration + 10
          expect(@target.foo).toEqual @tween.to

        it "should reset to the original value if @restoreAfter is set", ->
          @tween.restoreAfter = true
          @tween.update @tween.duration / 2
          expect(@target.foo).not.toEqual @tween.to
          expect(@tween.done).toBeFalsy()

          @tween.update @tween.duration + 10
          expect(@target.foo).toEqual @startingValue
          expect(@tween.done).toBeTruthy()

        it "shouldn't leave behind and temporary properties", ->
          @tween.update @tween.duration + 10
          expect(@target).toEqual { foo: 10 }

      describe 'easing functions', ->
        beforeEach ->
          @easingFunc = 'testEasingFunc'
          @easedValue = 12
          Easing[@easingFunc] = => @easedValue

        afterEach ->
          delete Easing[@easingFunc]

        it "should use the specified easing function", ->
          tween = new Tween
            targets: [@target]
            property: "foo"
            easing: @easingFunc
            from: 1
            to: 10
            duration: 2000
            
          tween.update 100
          expect(@target.foo).toEqual @easedValue


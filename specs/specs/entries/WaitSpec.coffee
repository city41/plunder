require ["Wait"], (Wait) ->
  getWait = ->
    new Wait
      duration: 100

  getMinMaxWait = (min=10, max=20) ->
    new Wait
      min: min
      max: max

  describe "Wait", ->
    describe "#constructor", ->
      it "should not be done", ->
        wait = getWait()
        expect(wait.done).toBeFalsy()

      it "should set duration from min and max", ->
        wait = getMinMaxWait(5, 10)

        expect(wait.duration).toBeGreaterThan(4)
        expect(wait.duration).toBeLessThan(11)

      it "should throw if min is greater than max", ->
        fn = ->
          getMinMaxWait(10, 5)

        expect(fn).toThrow()

    describe "#update", ->
      it "should wait for the specified duration", ->
        wait = getWait()

        for i in [0...99]
          wait.update(1)
          expect(wait.done).toBeFalsy()

        wait.update(1)
        expect(wait.done).toBeTruthy()



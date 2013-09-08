require ["Easie"], (Easie) ->
  describe "Easie", ->
    describe "#reverse", ->
      it "should quietly pass through non string values", ->
        expect(Easie.reverse()).toBeUndefined()
        expect(Easie.reverse(null)).toBeNull()
        expect(Easie.reverse(2)).toBe 2
        expect(Easie.reverse(true)).toBe true

      it "should quietly pass through non existant easings", ->
        expect(Easie.reverse('hellothere')).toBe 'hellothere'

      it "should leave non reversable easings alone", ->
        expect(Easie.reverse('linear')).toBe 'linear'

      it "should leave dual ended easings alone", ->
        expect(Easie.reverse('cubicInOut')).toBe 'cubicInOut'
        expect(Easie.reverse('circInOut')).toBe 'circInOut'
        expect(Easie.reverse('quadInOut')).toBe 'quadInOut'

      it "should reverse a reversable easing", ->
        expect(Easie.reverse('cubicIn')).toBe 'cubicOut'
        expect(Easie.reverse('quadOut')).toBe 'quadIn'

Easie = require('../../src/Easie')

describe "Easie", ->
  describe "#reverse", ->
    it "should quietly pass through non string values", ->
      expect(Easie.reverse()).to.be.undefined
      expect(Easie.reverse(null)).to.be.null
      expect(Easie.reverse(2)).to.eql(2)
      expect(Easie.reverse(true)).to.be.true

    it "should quietly pass through non existant easings", ->
      expect(Easie.reverse('hellothere')).to.eql('hellothere')

    it "should leave non reversable easings alone", ->
      expect(Easie.reverse('linear')).to.eql('linear')

    it "should leave dual ended easings alone", ->
      expect(Easie.reverse('cubicInOut')).to.eql('cubicInOut')
      expect(Easie.reverse('circInOut')).to.eql('circInOut')
      expect(Easie.reverse('quadInOut')).to.eql('quadInOut')

    it "should reverse a reversable easing", ->
      expect(Easie.reverse('cubicIn')).to.eql('cubicOut')
      expect(Easie.reverse('quadOut')).to.eql('quadIn')

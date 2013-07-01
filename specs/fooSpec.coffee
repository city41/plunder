require ['foo'], (foo) ->
  describe 'foo', ->
    it 'should return 2', ->
      expect(foo.bar()).toBe 2

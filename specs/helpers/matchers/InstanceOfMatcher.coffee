beforeEach ->
  @addMatchers 
    toBeInstanceOf: (expected) ->
      notText = if @isNot then " not" else ""

      @message = ->
        "Expected #{@actual}#{notText} to be instance of #{expected}"

      return @actual instanceof expected

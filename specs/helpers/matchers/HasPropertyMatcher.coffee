beforeEach ->
  @addMatchers 
    toHaveProperty: (expected) ->
      notText = if @isNot then " not" else ""

      @message = ->
        "Expected #{notText} to have property #{expected}"

      return @actual.hasOwnProperty(expected)


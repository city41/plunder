define 'Wait', ['Util'], (U) ->

  class Wait
    constructor: (config) ->
      U.extend(this, config)

      if @min? && @max? && @min > @max
        throw new Error("Wait: min must be less than max")

      @_specifiedDuration = @duration
      @reset()

    reverse: ->
      new Wait
        min: @min
        max: @max
        duration: @_specifiedDuration

    reset: ->
      @duration = @_specifiedDuration or U.rand(@min, @max)
      @_elapsed = 0
      @done = @_elapsed >= @duration

    update: (delta) ->
      return  if @done
      @_elapsed += delta
      @done = @_elapsed >= @duration



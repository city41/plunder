define ['./Util'], (U) ->

  class Wait
    constructor: (config) ->
      U.extend(this, config)

      if @min? && @max? && @min > @max
        throw new Error("Wait: min must be less than max")

      @_specifiedDuration = @duration
      @reset()

    reverse: ->
      new Wait
        duration: @duration

    reset: ->
      @duration = @_specifiedDuration or U.rand(@min, @max)
      @_elapsed = 0

    update: (delta) ->
      return  if @done
      @_elapsed += delta




  Object.defineProperty Wait::, 'done', 
    get: ->
      @_elapsed >= @duration

  return Wait



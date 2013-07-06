define 'Invoke', ['Util'], (U) ->

  class invoke
    constructor: (config) ->
      U.extend this, config
      @reset()

    reset: ->
      @done = false

    update: ->
      return  if @done
      
      @func.call(@context)
      @done = true


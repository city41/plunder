U = require('./Util')

class Invoke
  constructor: (config) ->
    U.extend this, config
    @reset()

  reset: ->
    @done = false

  reverse: ->
    new Invoke
      func: @func
      context: @context

  update: ->
    return  if @done

    @func.call(@context)
    @done = true

module.exports = Invoke

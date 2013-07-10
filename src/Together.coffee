define ->

  class Together
    constructor: (@children=[]) ->

    reset: ->
      for child in @children
        child.reset()

    reverse: ->
      reversedChildren = (child.reverse() for child in @children)
      new Together reversedChildren

    update: (args...)->
      return  if @done

      for child in @children
        child.update.apply child, args



  Object.defineProperty Together::, 'done',
    get: ->
      for child in @children
        return false if not child.done
      return true

  return Together



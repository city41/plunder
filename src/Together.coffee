class Together
  constructor: (@children=[]) ->

  reset: ->
    @done = false
    for child in @children
      child.reset()

  reverse: ->
    reversedChildren = (child.reverse() for child in @children)
    new Together reversedChildren

  update: (args...)->
    return  if @done

    childNotDone = false

    for child in @children
      child.update.apply child, args
      childNotDone = true unless child.done

    @done = not childNotDone

module.exports = Together

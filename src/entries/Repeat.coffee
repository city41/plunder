define "Repeat", ["Util"], (U) ->
  class Repeat
    constructor: (@count) ->
      @children = []
      @_currentChild = 0
      @_curCount = 0

    reset: ->
      @done = false
      @_currentChild = 0
      @_curCount = 0
      for child in children
        child.reset()


    update: (args...) ->
      @done = @_curCount >= @count
      return  if @done
      
      curChild = @children[@_currentChild]

      curChild.update.apply curChild, args

      if curChild.done
        ++@_currentChild
        if @_currentChild >= @children.length
          @_currentChild = 0

          ++@_curCount
          @done = @_curCount >= @count

          if not @done
            child.reset() for child in @children



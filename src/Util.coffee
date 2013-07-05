define 'Util', ->
  _isInteger = (num) ->
    num == (num | 0)

  Util =
    rand: (minOrMax, maxOrUndefined, dontFloor) ->
      dontFloor ?= false
      shouldFloor = !dontFloor

      min = if Util.isNumber(maxOrUndefined) then minOrMax else 0
      max = if Util.isNumber(maxOrUndefined) then maxOrUndefined else minOrMax
      range = max - min

      result = Math.random() * range + min

      if _isInteger(min) and _isInteger(max) and shouldFloor
        Math.floor result
      else
        result

    coin: ->
      @rand(0, 2) == 0

    isNumber: (n) ->
      typeof n == "number"

    isUndefined: (obj) ->
      typeof obj == "undefined"

    isFunction: (f) ->
      typeof f == "function"

    areSameTypes: (a, b) ->
      if @isArray(a) then return @isArray(b)
      if @isArray(b) then return @isArray(a)
      return typeof a == typeof b

    extend: (target, incoming) ->
      for own key, value of incoming
        target[key] = value

  Util.isArray = Array.isArray or (obj) ->
    toString.call(obj) == "[object Array]"

  Util


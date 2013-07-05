define 'Util', ->
  _isInteger = (num) ->
    num == (num | 0)

  Util =
    rand: (minOrMax, maxOrUndefined, dontFloor) ->
      dontFloor = false  if Util.isUndefined(dontFloor)
      min = (if Util.isNumber(maxOrUndefined) then minOrMax else 0)
      max = (if Util.isNumber(maxOrUndefined) then maxOrUndefined else minOrMax)
      range = max - min
      result = Math.random() * range + min
      if _isInteger(min) and _isInteger(max) and not dontFloor
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

    extend: (target, incoming) ->
      for key of incoming
        target[key] = incoming[key]  if incoming.hasOwnProperty(key)

  Util.isArray = Array.isArray or (obj) ->
    toString.call(obj) == "[object Array]"

  Util


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

    degreesToRadians: (degrees) ->
      degrees * Math.PI / 180

    radiansToDegrees: (radians) ->
      radians * 180 / Math.PI

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
      if target?
        for own key, value of incoming
          target[key] = value

      return target

    clone: (obj) ->
      @extend({}, obj)

    toArray: (obj) ->
      if !obj?
        return []

      if @isArray(obj) then obj else [obj]

    last: (array) ->
      array && array[array.length-1]

    first: (array) ->
      array && array[0]

    isEmpty: (array) ->
      array && array.length == 0

  Util.isArray = Array.isArray or (obj) ->
    toString.call(obj) == "[object Array]"

  return Util

define ['./Util'], (U) ->
  class Accessor
    constructor: (@obj, propertyPath) ->
      @paths = propertyPath.split(".")

    get: () ->
      obj = @obj
      obj = obj[path] for path in @paths
      return obj

    set: (value) ->
      obj = @obj
      for i in [0...@paths.length-1] by 1
        obj[@paths[i]] ?= {}
        obj = obj[@paths[i]]

      obj[U.last(@paths)] = value


define ['./Util'], (U) ->
  class Accessor
    constructor: (rootObj, propertyPath) ->
      paths = propertyPath.split(".")
      @_leafPath = U.last(paths)
      @_leafObj = @_getLeaf(rootObj, paths)

    get: () ->
      @_leafObj[@_leafPath]

    set: (value) ->
      @_leafObj[@_leafPath] = value

    _getLeaf: (obj, paths) ->
      for i in [0...paths.length-1]
        obj[paths[i]] ?= {}
        obj = obj[paths[i]]

      return obj


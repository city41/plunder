define ['./Util'], (U) ->
  Accessor =
    getProperty: (obj, propertyPath) ->
      paths = propertyPath.split(".")

      obj = obj[path] for path in paths
      return obj

    setProperty: (obj, propertyPath, value) ->
      paths = propertyPath.split(".")

      for i in [0...paths.length-1] by 1
        obj[paths[i]] ?= {}
        obj = obj[paths[i]]

      obj[U.last(paths)] = value

    deleteProperty: (obj, propertyPath) ->
      paths = propertyPath.split(".")

      for i in [0...paths.length-1] by 1
        return if not obj[paths[i]]

        obj = obj[paths[i]]

      delete obj[U.last(paths)]


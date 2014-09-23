U = require('./Util')

getBuilder = (loader, children) ->

class Loader
  constructor: ->
    @_anis = []

  _getBuilder: (children) ->
    return (timeline) =>
      for child in children
        @load(child, timeline)

  _findAni: (id) ->
    @_anis.filter((ani) ->
      ani.id == id
    ).pop()

  _getArgs: (args) ->
    args.map (arg) =>
      if U.isString(arg) && arg.indexOf("id:") == 0
        return @_findAni(arg.substring(3))
      else
        return arg

  load: (aniDef, timeline) ->
    method = timeline[aniDef.type]

    if aniDef.children
      ani = method.call(timeline, aniDef.childConfig || {}, @_getBuilder(aniDef.children))
    else
      args = @_getArgs(aniDef.args)
      ani = method.apply(timeline, args)

    ani.id = aniDef.id
    @_anis.push(ani)

module.exports = Loader

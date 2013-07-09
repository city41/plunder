define [ 
  "Util"
  "Bezier"
  "Tween"
  "Wait"
  "Repeat"
  "Together"
  "Invoke"
], (U, Bezier, Tween, Wait, Repeat, Together, Invoke) ->

  class Timeline
    constructor: (@owner) ->
      unless @owner
        throw new Error("Timeline requires an owner")
      @_buildStack = []
      @_childConfigStack = []

    _getTargets: (targetOptions) ->
      targets = targetOptions.targets ? targetOptions.target ?  @owner
      return U.toArray(targets)

    _mergeConfig: (config) ->
      if U.any(@_childConfigStack)
        return U.extend(U.clone(U.last(@_childConfigStack)), config)
      else
        return config

    _addParentAnimation: (childConfigOrBuilder, builderOrUndefined, AniConstructor, consArg) ->
      if U.isFunction(childConfigOrBuilder)
        builder = childConfigOrBuilder
      else
        childConfig = childConfigOrBuilder
        builder = builderOrUndefined

      parentAni = new AniConstructor(consArg)

      if childConfig
        @_childConfigStack.push childConfig

      @_buildStack.push parentAni
      builder this
      @_buildStack.pop()

      if childConfig
        @_childConfigStack.pop()

      @_pushAnimation parentAni

    _addAnimation: (AniConstructor, config) ->
      ani = new AniConstructor(@_mergeConfig(config))
      ani.targets = @_getTargets ani
      @_pushAnimation ani

    _pushAnimation: (ani) ->
      if @_buildStack.length is 0
        @owner.addAni ani
      else
        @_buildStack[@_buildStack.length - 1].children.push ani

      return ani

    ## Animation creation helpers

    _fade: (config, from, to) ->
      config = duration: config  if U.isNumber(config)
      config.property = "alpha"
      config.from = from
      config.to = to
      @_addAnimation Tween, config

    ## Animations
    
    reverse: (ani) ->
      @_pushAnimation ani.reverse()

    setProperty: (config = {}) ->
      config.duration = 0
      config.from = config.to = config.value
      @tween config

    bezier: (config = {}) ->
      @_addAnimation Bezier, config

    tween: (config = {}) ->
      @_addAnimation Tween, config

    fadeIn: (config = {}) ->
      @_fade config, 0, 1

    fadeOut: (config = {}) ->
      @_fade config, 1, 0

    scale: (config = {}) ->
      config.property = 'scale'
      @tween(config)

    color: (config = {}) ->
      config.property = 'color'
      @tween(config)

    rotate: (config = {}) ->
      config.property = 'angle'
      @tween(config)

    move: (config) ->
      xconfig = U.clone(config)
      xconfig.easing = config.easingX ? config.easing
      xconfig.from = config.from.x
      xconfig.to = config.to.x
      xconfig.property = 'x'

      yconfig = U.clone(config)
      yconfig.easing = config.easingY ? config.easing
      yconfig.from = config.from.y
      yconfig.to = config.to.y
      yconfig.property = 'y'

      @together (tl) ->
        tl.tween(xconfig)
        tl.tween(yconfig)

    together: (childConfigOrBuilder, builderOrUndefined) ->
      @_addParentAnimation childConfigOrBuilder, builderOrUndefined, Together

    sequence: (childConfigOrBuilder, builderOrUndefined) ->
      @repeat 1, childConfigOrBuilder, builderOrUndefined

    forever: (childConfigOrBuilder, builderOrUndefined) ->
      @repeat(Infinity, childConfigOrBuilder, builderOrUndefined)

    repeat: (count, childConfigOrBuilder, builderOrUndefined) ->
      @_addParentAnimation childConfigOrBuilder, builderOrUndefined, Repeat, count

    wait: (duration) ->
      @waitBetween duration, duration

    waitBetween: (min, max) ->
      @_addAnimation  Wait, { min, max }

    invoke: (func, context) ->
      @_addAnimation Invoke, { func, context }

    ## Animation maintenance

    stop: ->
      @owner.clearAnis()


define "Timeline",
  [ 
    "Util"
    "Tween"
    "Wait"
    "Repeat"
    "Together"
    "Invoke"
  ], (U, Tween, Wait, Repeat, Together, Invoke) ->

    # TODO: Turn the targetStack into a configStack
    
    class Timeline
      constructor: (@owner) ->
        unless @owner
          throw new Error("Timeline requires an owner")
        @_buildStack = []
        @_targetStack = []

      _getTargets: (targetOptions, getOptions) ->
        defaultTarget = @owner
        
        if getOptions?.useTargetStack && U.any(@_targetStack)
          defaultTarget = U.last(@_targetStack)

        targets = targetOptions.targets ? targetOptions.target ?  defaultTarget
        return U.toArray(targets)

      _addParentAnimation: (builder, targetOptions, parentAni) ->
        if targetOptions
          @_targetStack.push @_getTargets(targetOptions)

        @_buildStack.push parentAni

        builder this

        @_buildStack.pop()

        if targetOptions
          @_targetStack.pop()

        @_pushAnimation parentAni

      _addAnimation: (ani) ->
        ani.targets = @_getTargets ani, useTargetStack: true
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
        @_addAnimation new Tween(config)

      _defaultTween: (property, config, defaultValue = 0) ->
        @tween
          property: property
          from: config.from ? defaultValue
          to: config.to ? defaultValue
          duration: config.duration ? 0
          easing: config.easing

      _createParent: (targetOptionsOrBuilder, builderOrUndefined, parentAni) ->
        if U.isFunction(targetOptionsOrBuilder)
          builder = targetOptionsOrBuilder
        else
          targetOptions = targetOptionsOrBuilder
          builder = builderOrUndefined

        @_addParentAnimation builder, targetOptions, parentAni

      ## Animations
      
      reverse: (ani) ->
        @_pushAnimation ani.reverse()

      setProperty: (config) ->
        config.duration = 0
        config.from = config.to = config.value
        @tween config

      tween: (config) ->
        @_addAnimation new Tween(config)

      fadeIn: (config) ->
        @_fade config, 0, 1

      fadeOut: (config) ->
        @_fade config, 1, 0

      scale: (config = {}) ->
        @_defaultTween 'scale', config

      color: (config = {}) ->
        @_defaultTween 'color', config, [0,0,0,0]

      rotate: (config = {}) ->
        @_defaultTween 'angle', config

      move: (config) ->
        xconfig = U.clone(config)
        xconfig.easing = config.easingX ? config.easing
        xconfig.from = config.from.x
        xconfig.to = config.to.x

        yconfig = U.clone(config)
        yconfig.easing = config.easingY ? config.easing
        yconfig.from = config.from.y
        yconfig.to = config.to.y

        @together (tl) ->
          tl._defaultTween 'x', xconfig
          tl._defaultTween 'y', yconfig

      together: (targetOptionsOrBuilder, builderOrUndefined) ->
        @_createParent targetOptionsOrBuilder, builderOrUndefined, new Together()

      sequence: (targetOptionsOrBuilder, builderOrUndefined) ->
        @repeat 1, targetOptionsOrBuilder, builderOrUndefined

      forever: (targetOptionsOrBuilder, builderOrUndefined) ->
        @repeat(Infinity, targetOptionsOrBuilder, builderOrUndefined)

      repeat: (count, targetOptionsOrBuilder, builderOrUndefined) ->
        @_createParent targetOptionsOrBuilder, builderOrUndefined, new Repeat(count)

      wait: (millis) ->
        @waitBetween millis, millis

      waitBetween: (min, max) ->
        @_addAnimation new Wait({ min, max })

      invoke: (func, context) ->
        @_addAnimation new Invoke({ func, context })

      ## Animation maintenance

      stop: ->
        @owner.clearAnis()


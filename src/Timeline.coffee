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
      constructor: (owner) ->
        unless owner
          throw new Error("Timeline requires an owner")

        @_owner = owner
        @_buildStack = []
        @_targetStack = []
        @_addedAnis = []

      _getTargets: (targetOptions, getOptions) ->
        defaultTarget = @_owner
        
        if getOptions?.useTargetStack && !U.isEmpty(@_targetStack)
          defaultTarget = U.last(@_targetStack)

        targets = targetOptions.targets ? targetOptions.target ?  defaultTarget
        return U.toArray(targets)

      _addParentAnimation: (builder, targetOptions, AniConstructor, consArg) ->
        ani = new AniConstructor(consArg)

        if targetOptions
          @_targetStack.push @_getTargets(targetOptions)

        @_buildStack.push ani

        builder this

        @_buildStack.pop()

        if targetOptions
          @_targetStack.pop()

        @_pushAnimation ani

      _addAnimation: (AniConstructor, config) ->
        config.targets = @_getTargets config, useTargetStack: true
        ani = new AniConstructor(config)

        @_pushAnimation ani

      _pushAnimation: (ani) ->
        if @_buildStack.length is 0
          @_addedAnis.push ani
          @_owner.addAni ani
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

      _defaultTween: (property, config, defaultValue = 0) ->
        @tween
          property: property
          from: config.from ? defaultValue
          to: config.to ? defaultValue
          duration: config.duration ? 0
          easing: config.easing

      _createParent: (targetOptionsOrBuilder, builderOrUndefined, AniConstructor, conArgs) ->
        if U.isFunction(targetOptionsOrBuilder)
          builder = targetOptionsOrBuilder
        else
          targetOptions = targetOptionsOrBuilder
          builder = builderOrUndefined

        @_addParentAnimation builder, targetOptions, AniConstructor, conArgs

      ## Animations
      
      reverse: (ani) ->
        @_pushAnimation ani.reverse()

      setProperty: (config) ->
        config.duration = 0
        config.from = config.to = config.value
        @tween config

      tween: (config) ->
        @_addAnimation Tween, config

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
        xconfig = U.extend({}, config)
        xconfig.easing = config.easingX ? config.easing
        xconfig.from = config.from.x
        xconfig.to = config.to.x

        yconfig = U.extend({}, config)
        yconfig.easing = config.easingY ? config.easing
        yconfig.from = config.from.y
        yconfig.to = config.to.y

        @together (tl) ->
          tl._defaultTween 'x', xconfig
          tl._defaultTween 'y', yconfig

      sequence: (targetOptionsOrBuilder, builderOrUndefined) ->
        @repeat 1, targetOptionsOrBuilder, builderOrUndefined

      together: (targetOptionsOrBuilder, builderOrUndefined) ->
        @_createParent targetOptionsOrBuilder, builderOrUndefined, Together

      repeat: (count, targetOptionsOrBuilder, builderOrUndefined) ->
        @_createParent targetOptionsOrBuilder, builderOrUndefined, Repeat, count

      forever: (targetOptionsOrBuilder, builderOrUndefined) ->
        @repeat(Infinity, targetOptionsOrBuilder, builderOrUndefined)

      wait: (millis) ->
        @waitBetween millis, millis

      waitBetween: (min, max) ->
        @_addAnimation Wait, { min, max }

      invoke: (func, context) ->
        @_addAnimation Invoke, { func, context }

      end: ->
        unless U.isEmpty(@_buildStack)
          @invoke =>
            @stop()

      stop: ->
        @_owner.clearAnis()


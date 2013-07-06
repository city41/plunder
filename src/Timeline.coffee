define "Timeline",
  [ 
    "Util"
    "Tween"
    "Wait"
    "Repeat"
    "Together"
    "Invoke"
  ], (U, Tween, Wait, Repeat, Together, Invoke) ->

    class Timeline
      constructor: (owner) ->
        if not owner
          throw new Error("Timeline requires an owner")

        @_owner = owner
        @_buildStack = []
        @_targetStack = []
        @_addedAnis = []

      _getTargets: (targetOptions) ->
        targets = targetOptions.targets ? targetOptions.target ? @_owner
        U.toArray(targets)

      _addAnimationToOwner: (ani) ->
        @_addedAnis.push ani
        @_owner.addAni ani

      _addParentAnimation: (builder, targetOptions, AniConstructor, consArg) ->
        ani = new AniConstructor(consArg)

        if targetOptions
          targets = @_getTargets(targetOptions)
          @_targetStack.push targets

        @_buildStack.push ani

        builder this

        @_buildStack.pop()
        @_targetStack.pop() if targetOptions

        if @_buildStack.length is 0
          @_addAnimationToOwner ani
        else
          @_buildStack[@_buildStack.length - 1].children.push ani
        ani

      _addAnimation: (config, AniConstructor) ->
        unless config.targets
          if config.target
            config.targets = config.target
          else if @_targetStack.length > 0
            config.targets = @_targetStack.last
          else
            config.targets = @_owner

        config.targets = U.toArray(config.targets)

        ani = new AniConstructor(config)

        if @_buildStack.length is 0
          @_addAnimationToOwner ani
        else
          @_buildStack[@_buildStack.length - 1].children.push ani
        ani

      _fade: (config, from, to) ->
        config = duration: config  if U.isNumber(config)
        config.property = "alpha"
        config.from = from
        config.to = to
        @_addAnimation config, Tween

      ## Animations

      setProperty: (config) ->
        config.duration = 0
        config.from = config.to = config.value
        @tween config

      tween: (config) ->
        @_addAnimation config, Tween

      fadeIn: (config) ->
        @_fade config, 0, 1

      fadeOut: (config) ->
        @_fade config, 1, 0

      sequence: (targetOptionsOrBuilder, builderOrUndefined) ->
        @repeat 1, targetOptionsOrBuilder, builderOrUndefined

      together: (targetOptionsOrBuilder, builderOrUndefined) ->
        if U.isFunction(targetOptionsOrBuilder)
          builder = targetOptionsOrBuilder
        else
          targetOptions = targetOptionsOrBuilder
          builder = builderOrUndefined
        
        @_addParentAnimation builder, targetOptions, Together

      repeat: (count, targetOptionsOrBuilder, builderOrUndefined) ->
        if U.isFunction(targetOptionsOrBuilder)
          builder = targetOptionsOrBuilder
        else
          targetOptions = targetOptionsOrBuilder
          builder = builderOrUndefined
        
        @_addParentAnimation builder, targetOptions, Repeat, count

      forever: (targetOptionsOrBuilder, builderOrUndefined) ->
        @repeat(Infinity, targetOptionsOrBuilder, builderOrUndefined)

      wait: (millis) ->
        @waitBetween millis, millis

      waitBetween: (min, max) ->
        @_addAnimation { min, max }, Wait

      invoke: (func, context) ->
        @_addAnimation { func, context }, Invoke

      end: ->
        rootAni = @_buildStack.first
        if rootAni
          @invoke =>
            @die()

      die: ->
        @_owner?.clearAnis()


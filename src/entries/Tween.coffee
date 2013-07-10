define ['./Easing', './Util', './Accessor'], (Easing, U, A) ->
  _idCounter = 0

  class Tween
    constructor: (config) ->
      U.extend this, config
      @_saveProperty = @property + "_save_" + (_idCounter++)
      @easeFunc = Easing[@easing || "linearTween"] || Easing.linearTween
      @reset()

    reset: ->
      @_elapsed = 0
      @done = @_elapsed >= @duration
      @_targetsInitted = false

    reverse: ->
      new Tween
        property: @property
        targets: @targets
        from: @to
        to: @from
        easing: @easing
        duration: @duration

    _initTargets: ->
      for target in @targets
        curValue = A.getProperty(target, @property)

        if U.isArray(curValue)
          A.setProperty target, @_saveProperty, curValue.slice(0)
        else
          A.setProperty target, @_saveProperty, curValue

        value = if @from? then @from else target[@property]

        if curValue? && (!U.areSameTypes(value, curValue) || !U.areSameTypes(value, @to))
          throw new Error("Tween: mismatched types between from/to and targets current value")

        value = value.slice(0)  if U.isArray(value)
        A.setProperty target, @property, value
      @_targetsInitted = true

    update: (delta) ->
      return  if @done or @disabled

      # it's important for larger sequencing to only init targets once the animation is running
      @_initTargets() if not @_targetsInitted

      @_elapsed += delta

      if @_elapsed >= @duration
        @_elapsed = @duration
        @done = true
      else
        @_tween target for target in @targets

      if @done
        @_finish()

    _finish: ->
      for target in @targets
        finalValue = if @restoreAfter then A.getProperty(target, @_saveProperty) else @to
        A.setProperty target, @property, finalValue
        A.deleteProperty target, @_saveProperty

    _tween: (target) ->
      curValue = A.getProperty(target, @property)

      if U.isArray(curValue)
        for cell, i in curValue
          from = @from or target[@_saveProperty]
          curValue[i] = @_tweenValue(@_elapsed, from[i], @to[i], @duration)

      else if U.isNumber(curValue)
        tweenedValue = @_tweenValue(@_elapsed, @from, @to, @duration)
        A.setProperty target, @property, tweenedValue
      else
        throw new Error("Tween can only operate on numbers or arrays of numbers")

    _tweenValue: (elapsed, from, to, duration) ->
      position = @easeFunc(elapsed, from, to - from, duration)
      return position


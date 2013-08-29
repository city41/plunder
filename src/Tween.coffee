define ['./Easie', './Util', './Accessor'], (Easie, U, Accessor) ->
  _idCounter = 0

  class Tween
    constructor: (config) ->
      @id = _idCounter++
      U.extend this, config
      @_saveProperty = "_plunder_tween_save_#{@id}"
      @_accessorProp = "__accessorProp#{@id}"

      @easeFunc = Easie[@easing || "linear"] || Easie.linear
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

    _initTargets: ->
      for target in @targets
        target[@_accessorProp] = new Accessor(target, @property)
        curValue = @_get(target)

        target[@_saveProperty] = if U.isArray(curValue) then curValue.slice(0) else curValue
        value = @from ? curValue

        if curValue? && (!U.areSameTypes(value, curValue) || !U.areSameTypes(value, @to))
          throw new Error("Tween: mismatched types between from/to and targets current value")

        value = value.slice(0) if U.isArray(value)
        @_set(target, value)

      @_targetsInitted = true

    _finish: ->
      for target in @targets
        finalValue = if @restoreAfter then target[@_saveProperty] else @to
        @_set(target, finalValue)
        @_del(target)

    _tween: (target) ->
      curValue = @_get(target)
      from = @from ? target[@_saveProperty]

      if U.isArray(curValue)
        for cell, i in curValue
          curValue[i] = @_tweenValue(@_elapsed, from[i], @to[i], @duration)

      else if U.isNumber(curValue)
        tweenedValue = @_tweenValue(@_elapsed, from, @to, @duration)
        @_set(target, tweenedValue)
      else
        throw new Error("Tween can only operate on numbers or arrays of numbers")

    _tweenValue: (elapsed, from, to, duration) ->
      @easeFunc(elapsed, from, to - from, duration)

    _get: (target) ->
      target[@_accessorProp].get()

    _set: (target, value) ->
      target[@_accessorProp].set(value)

    _del: (target) ->
      delete target[@_saveProperty]
      delete target[@_accessorProp]


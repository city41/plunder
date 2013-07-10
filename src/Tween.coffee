define ['./Easing', './Util', './Accessor'], (Easing, U, Accessor) ->
  _idCounter = 0

  class Tween
    constructor: (config) ->
      @id = _idCounter++
      U.extend this, config
      @_saveProperty = "#{@property}_save_#{@id}"
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
        target["__prop#{@id}"] = new Accessor(target, @property)
        target["__save#{@id}"] = new Accessor(target, @_saveProperty)
        curValue = @_get(target)

        if U.isArray(curValue)
          @_set(target, curValue.slice(0), "save")
        else
          @_set(target, curValue, "save")

        value = @from ? curValue

        if curValue? && (!U.areSameTypes(value, curValue) || !U.areSameTypes(value, @to))
          throw new Error("Tween: mismatched types between from/to and targets current value")

        value = value.slice(0)  if U.isArray(value)
        @_set(target, value)

      @_targetsInitted = true

    _finish: ->
      for target in @targets
        finalValue = if @restoreAfter then @_get(target, "save") else @to
        @_set(target, finalValue)
        @_del(target)

    _tween: (target) ->
      curValue = @_get(target)
      from = @from ? @_get(target, "save")

      if U.isArray(curValue)
        for cell, i in curValue
          curValue[i] = @_tweenValue(@_elapsed, from[i], @to[i], @duration)

      else if U.isNumber(curValue)
        tweenedValue = @_tweenValue(@_elapsed, from, @to, @duration)
        @_set(target, tweenedValue)
      else
        throw new Error("Tween can only operate on numbers or arrays of numbers")

    _tweenValue: (elapsed, from, to, duration) ->
      position = @easeFunc(elapsed, from, to - from, duration)
      return position

    _get: (target, type="prop") ->
      target["__#{type}#{@id}"].get()

    _set: (target, value, type="prop") ->
      target["__#{type}#{@id}"].set(value)

    _del: (target) ->
      target["__save#{@id}"].del()
      delete target["__save#{@id}"]
      delete target["__prop#{@id}"]


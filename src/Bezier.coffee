define ['./Util'], (U) ->

  # TODO: support @restoreAfter

  class Bezier
    constructor: (config) ->
      U.extend this, config
      @reset()

    reset: ->
      @_elapsed = 0
      @done = @_elapsed >= @duration
      @_targetsInitted = false

    reverse: ->
      new Bezier
        targets: @targets
        points: @_reversePoints(@points)
        duration: @duration

    _reversePoints: (points) ->
      # TODO : support more than one segment
      points = U.clone(points)
      @_swap(points, 0, 3)
      @_swap(points, 1, 2)

      return points

    _swap: (array, a, b) ->
      temp = array[a]
      array[a] = array[b]
      array[b] = temp

    _initTargets: ->
      for target in @targets
        target.x = @points[0].x
        target.y = @points[0].y

      @_targetsInitted = true

    update: (delta) ->
      return if @done or @disabled

      @_initTargets() if not @_targetsInitted

      @_elapsed += delta

      if @_elapsed > @duration
        @_elapsed = @duration
        @done = true
      else
        @_move target for target in @targets


    _move: (target) ->
      # TODO: suppoert more than the first index

      percent = @_elapsed / @duration
      { x, y } = @_computeBezier(0, percent)

      target.x = x
      target.y = y

    _computeBezier: (index, time) ->
      # taken from my ancient Java game engine:
      # http://jasel.cvs.sourceforge.net/viewvc/jasel/jasel/vehicle/BezierVehicle.java?view=markup

      t = time
      p1 = @points[index]
      p2 = @points[index+1]
      p3 = @points[index+2]
      p4 = @points[index+3]

      oneMinusT = 1- t
      oneMinusTCubed = oneMinusT * oneMinusT * oneMinusT
      tCubed = t * t * t

      x1 = oneMinusTCubed * p1.x
      x2 = 3 * t * oneMinusT * oneMinusT * p2.x
      x3 = 3 * t * t * oneMinusT * p3.x
      x4 = tCubed * p4.x

      x = x1 + x2 + x3 + x4

      y1 = oneMinusTCubed * p1.y
      y2 = 3 * t * oneMinusT * oneMinusT * p2.y
      y3 = 3 * t * t * oneMinusT * p3.y
      y4 = tCubed * p4.y

      y = y1 + y2 + y3 + y4

      return { x, y }



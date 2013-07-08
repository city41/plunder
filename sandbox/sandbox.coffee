require ['Timeline', 'Util'], (Timeline, U) ->

  #
  # Sandbox
  # =======
  # This is a minimal implemenation of Plunder, it gives an idea 
  # of what games/engines will need to do to use Plunder
  # and provides a testing ground for playing with Plunder
  #
  # Most of the implementation here will be hidden to games via 
  # plugins or what not, allowing Plunder and the game engine to 
  # work together with minimal effort from the developer
  #

  #
  # define something that Plunder can manipulate
  #
  class Entity
    constructor: ->
      @timeline = new Timeline(this)
      @anis = []
      @x = 10
      @y = 10
      @alpha = 1
      @color = [255, 0, 0, 1]

    # have the entity run a bezier path animation
    # this method and standard() below are just convenient
    # places to dump Plunder animation calls, to play
    # with the system.
    bezier: ->
      tl = @timeline
      tl.forever duration: 2000, ->
        tl.wait 1000
        t = tl.together ->
          tl.color
            from: [255, 0, 0, 1]
            to: [0, 0, 255, 1]
          tl.sequence duration: 1000, ->
            s = tl.scale
              from: 1
              to: 4
            tl.reverse(s)
          tl.bezier
            points: [
              { x: 10, y: 10 }
              { x: 10, y: 60 }
              { x: 100, y: 40 }
              { x: 100, y: 100 }
            ]
        tl.wait 1000
        tl.reverse(t)

    # have the entity run a standard animation
    # this is the same animation currently featured on Plunder's website
    standard: ->
      tl = @timeline
      tl.forever ->
        group = tl.together duration: 2000, ->
          tl.rotate
            from: 0
            to: 720
          tl.color
            from: [255, 0, 0, 1]
            to: [0, 0, 255, 0]
          tl.scale
            from: 1
            to: 10
          tl.move
            from: x: 10, y: 10
            to: x: 300, y: 200
        tl.wait 500
        tl.reverse(group)

    # this method is required by Plunder, an ani
    # is something like tween, bezier, scale, etc
    addAni: (ani) ->
      @anis.push(ani)

    # also required by Plunder, but so far not really used
    clearAnis: ->
      @anis = []

    # also required by Plunder, update the anis in each run of the
    # game loop. delta is how much time has passed since the previous
    # game loop call. Time units don't matter to Plunder, as long as
    # delta here and duration in the Timeline calls are the same unit
    update: (delta) ->
      for ani in @anis
        ani.update(delta)

    # when drawing the entity, Plunder has tweened various properties
    # such as scale, color and angle. use those properties to determine
    # how to draw the entity
    draw: (context) ->
      context.save()

      context.fillStyle = "rgba(#{@color[0] | 0}, #{@color[1] | 0}, #{@color[2] | 0}, #{@color[3]})"

      context.translate(@x, @y)
      context.scale(@scale, @scale) if @scale
      context.rotate(U.degreesToRadians(@angle)) if @angle
      context.fillRect(-5, -5, 10, 10)

      context.restore()


  entity = new Entity()

  #
  # decide which animation to run
  #

  # entity.standard()
  entity.bezier()


  #
  # the rest is standard canvas and requestAnimationFrame stuff
  # that most JS game engines have somewhere inside
  #

  context = document.getElementById('canvas').getContext('2d')

  lastTimestamp = null

  update = (ts) ->
    lastTimestamp ?= ts
    delta = ts - lastTimestamp
    lastTimestamp = ts

    entity.update(delta)

    context.clearRect(0, 0, context.canvas.width, context.canvas.height)
    entity.draw(context)
    window.requestAnimationFrame(update)

  update(0)



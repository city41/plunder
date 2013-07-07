require ['Timeline', 'Util'], (Timeline, U) ->

  class Entity
    constructor: ->
      @anis = []
      @x = 10
      @y = 10
      @alpha = 1
      @color = [255, 0, 0, 1]

    addAni: (ani) ->
      @anis.push(ani)

    clearAnis: ->
      @anis = []

    update: (delta) ->
      for ani in @anis
        ani.update(delta)

    draw: (context) ->
      context.save()

      context.fillStyle = "rgba(#{@color[0] | 0}, #{@color[1] | 0}, #{@color[2] | 0}, #{@color[3]})"

      context.translate(@x, @y)
      context.scale(@scale, @scale) if @scale
      context.rotate(U.degreesToRadians(@angle)) if @angle
      context.fillRect(-5, -5, 10, 10)

      context.restore()


  entity = new Entity()
  tl = new Timeline(entity)

  tl.forever (tl) ->
    group = tl.together (tl) ->
      tl.rotate
        from: 0
        to: 720
        duration: 2000
      tl.color
        from: [255, 0, 0, 1]
        to: [0, 0, 255, 0]
        duration: 2000
      tl.scale
        from: 1
        to: 10
        duration: 2000
      tl.move
        from: x: 10, y: 10
        to: x: 300, y: 100
        duration: 2000
        easingX: 'easeInOutQuad'
    tl.wait 500
    tl.reverse(group)

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



require ['Timeline'], (Timeline) ->

  class Entity
    constructor: ->
      @anis = []
      @x = 10
      @y = 10
      @alpha = 1
      @color = [0,0,0,0]

    addAni: (ani) ->
      @anis.push(ani)

    clearAnis: ->
      @anis = []

    update: (delta) ->
      for ani in @anis
        ani.update(delta)

    draw: (context) ->
      context.save()
      # context.fillStyle = "rgba(255, 0, 0, #{@alpha})"
      context.fillStyle = "rgba(#{@color[0] | 0}, #{@color[1] | 0}, #{@color[2] | 0}, #{@color[3]})"

      w = 10
      h = 10

      if @scale?
        w *= @scale
        h *= @scale

      context.fillRect(@x, @y, w, h)
      context.restore()


  entity = new Entity()
  tl = new Timeline(entity)

  tl.forever (tl) ->
    tl.together (tl) ->
      tl.tint
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
    tl.together (tl) ->
      tl.scale
        from: 10
        to: 1
        duration: 2000
      tl.tint
        from: [0, 0, 255, 0]
        to: [255, 0, 0, 1]
        duration: 2000
      tl.move
        from: x: 300, y: 100
        to: x: 10, y: 10
        duration: 2000
        easingX: 'easeInOutQuad'


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



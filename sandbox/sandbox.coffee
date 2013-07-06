require ['Timeline'], (Timeline) ->

  class Entity
    constructor: ->
      @anis = []
      @x = 10
      @y = 10
      @alpha = 1

    addAni: (ani) ->
      @anis.push(ani)

    clearAnis: ->
      @anis = []

    update: (delta) ->
      for ani in @anis
        ani.update(delta)

    draw: (context) ->
      context.save()
      context.fillStyle = "rgba(255, 0, 0, #{@alpha})"
      if @scale?
        context.scale(@scale, @scale)

      context.fillRect(@x, @y, 10, 10)
      context.restore()



  entity = new Entity()
  tl = new Timeline(entity)
  tl.forever (tl) ->
    tl.together (tl) ->
      tl.fadeOut
        duration: 2000
      tl.scale
        from: 1
        to: 3
        duration: 2000
      tl.move
        from: x: 10, y: 10
        to: x: 300, y: 100
        duration: 2000
        easingX: 'easeInOutQuad'
    tl.wait 500
    tl.together (tl) ->
      tl.scale
        from: 3
        to: 1
        duration: 2000
      tl.fadeIn
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



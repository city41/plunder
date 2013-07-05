require ['Timeline'], (Timeline) ->

  class Entity
    constructor: ->
      @timeline = new Timeline(this)
      @anis = []
      @x = 10
      @y = 10

    _addAni: (ani) ->
      @anis.push(ani)

    _clearAnis: ->
      @anis = []

    update: (delta) ->
      for ani in @anis
        ani.update(delta)

    draw: (context) ->
      context.fillStyle = 'red'
      context.fillRect(@x, @y, 10, 10)


  entity = new Entity()
  entity.timeline.tween
    property: 'x'
    from: 10
    to: 100
    duration: 2000
    easing: 'easeInOutQuad'

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



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
  entity.timeline.repeat 2, (tl) ->
    tl.together (tl) ->
      tl.tween
        property: 'y'
        from: 10
        to: 50
        duration: 2000
      tl.tween
        property: 'x'
        from: 10
        to: 100
        duration: 2000
        easing: 'easeInOutQuad'
    tl.wait 500
    tl.together (tl) ->
      tl.tween
        property: 'y'
        from: 50
        to: 10
        duration: 2000
      tl.tween
        property: 'x'
        from: 100
        to: 10
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



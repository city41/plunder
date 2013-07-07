require ['Timeline', 'Util'], (Timeline, U) ->

  class Entity
    constructor: ->
      @timeline = new Timeline(this)
      @anis = []
      @x = 10
      @y = 10
      @alpha = 1
      @color = [255, 0, 0, 1]

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

  # entity.standard()
  entity.bezier()


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



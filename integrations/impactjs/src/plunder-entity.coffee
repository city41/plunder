ig.module("plugins.plunder-entity")
.requires("impact.entity")
.defines ->

  ig.Entity.inject
    init: (x, y, settings) ->
      @ani = new Timeline(this)
      @anis = []
      @parent x, y, settings

    update: ->
      for ani in @anis
        ani.update ig.system.tick

      @parent()

    addPlunderAnimation: (ani) ->
      @anis.push ani

    clearPlunderAnimations: ->
      @anis = []

    draw: ->
      originalAlpha = ig.system.context.globalAlpha
      ig.system.context.globalAlpha = if @alpha? then @alpha else originalAlpha
      @parent()
      ig.system.context.globalAlpha = originalAlpha


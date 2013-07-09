ig.module("plugins.plunder-entity")
.requires("impact.entity")
.defines ->

  ig.Entity.inject
    init: (x, y, settings) ->
      @ani = new Timeline(this)
      @anis = []
      @parent x, y, settings

    update: ->
      @parent()

      for ani in @anis
        ani.update ig.system.tick
      # avoid creation of results array, has to be a better way...
      return

    addAni: (ani) ->
      @anis.push ani

    clearAnis: ->
      @anis = []

    draw: ->
      originalAlpha = ig.system.context.globalAlpha
      ig.system.context.globalAlpha = if @alpha? then @alpha else originalAlpha
      @parent()
      ig.system.context.globalAlpha = originalAlpha


Loader = require('../../src/Loader')

describe "Loader", ->
  beforeEach ->
    @timeline =
      tween: @stub().returns({})
      move: @stub().returns({})
      reverse: @stub().returns({})
      together: @stub().returns({})

    @loader = new Loader()

  it "should invoke the simple command on the timeline", ->
    @loader.load(
      type: "move"
      args: [1, 2]
    ,
      @timeline
    )

    expect(@timeline.move).to.have.been.calledWith(1, 2)

  it "should recursively build child commands", ->
    @loader.load(
      type: "together"
      children: [
        type: "move"
        args: [1, 2]
      ]
    ,
      @timeline
    )

    builderFn = @timeline.together.firstCall.args[1]
    builderFn(@timeline)

    expect(@timeline.move).to.have.been.calledWith(1, 2)

  describe "ids", ->
    it "should assign the id to the ani", ->
      @loader.load(
        type: "move"
        args: [1, 2]
        id: "myid"
      ,
        @timeline
      )

      expect(@loader._findAni("myid")).not.to.be.undefined

    it "should find an ani by id and pass it in as an arg", ->
      debugger
      @loader.load(
        type: "together"
        children: [
          type: "move"
          args: [1, 2]
          id: "myid"
        ,
          type: "reverse"
          args: ["id:myid"]
        ]
      ,
        @timeline
      )

      builderFn = @timeline.together.firstCall.args[1]
      builderFn(@timeline)

      moveAni = @loader._findAni("myid")
      expect(moveAni).not.to.be.undefined
      expect(@timeline.reverse).to.have.been.calledWith(moveAni)

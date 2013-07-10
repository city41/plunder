require ["Repeat"], (Repeat) ->
  describe "Repeat", ->
    getChild = ->
      update: ->
        @done = true
        @update.called ?= 0
        ++@update.called
      reset: ->
      reverse: ->


    beforeEach ->
      @children = [getChild(), getChild()]

      @repeat = new Repeat(2)
      @repeat.children = @children

    describe "#update", ->
      it "should update the children in sequence", ->
        for child in @children
          spyOn child, "reset"

        @repeat.update()
        expect(@children[0].update.called).toBe 1
        expect(@children[1].update.called).toBeUndefined()
        delete @children[0].update.called

        @repeat.update()
        expect(@children[0].update.called).toBeUndefined()
        expect(@children[1].update.called).toBe 1

        for child in @children
          expect(child.reset).toHaveBeenCalled()


      it "should repeat the cycle", ->
        @repeat.update()
        expect(@children[0].update.called).toBe 1
        expect(@children[1].update.called).toBeUndefined()
        
        @repeat.update()
        expect(@children[0].update.called).toBe 1
        expect(@children[1].update.called).toBe 1
        
        @repeat.update()
        expect(@children[0].update.called).toBe 2
        expect(@children[1].update.called).toBe 1
        
        @repeat.update()
        expect(@children[0].update.called).toBe 2
        expect(@children[1].update.called).toBe 2

    describe "#reverse", ->
      it "should not be the same animation", ->
        reversed = @repeat.reverse()
        expect(reversed).not.toBe @repeat

      it "should call reverse() on all its children", ->
        for child in @children
          spyOn child, "reverse"

        @repeat.reverse()

        for child in @children
          expect(child.reverse).toHaveBeenCalled()


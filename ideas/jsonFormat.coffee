


t = new Timeline(this)

t.run
  forever: [
    {
      tween:
        property: 'x'
        from: 10
        to: 100
    }
    { wait: 100 }
    {

    }



t.tween('x').from(10).to(100).for(1000)


t.tween 'x:from10->100:for1000'

t.tween 'prop=x,from=10,to=100,for=1000'


t.together (t) ->
  t.tween 'prop:x,from:10,to:100,for:1000'
  t.tween 'prop:y,from:10,to:100,for:1000'



t.run [
  



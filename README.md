# Plunder [![Build Status](https://secure.travis-ci.org/city41/plunder.png?branch=master)](http://travis-ci.org/city41/plunder) [![Stories in Ready](https://badge.waffle.io/city41/plunder.png)](http://waffle.io/city41/plunder)

[Plunder's website](http://plunderjs.com)

A tween based animation system for JavaScript game engines.

Plunder is a powerful, expressive animation system that can help fill in the gaps on smaller game engines such as ImpactJS.
I'd love to see Plunder become so compelling that even people using more complete engines like Lime want to use it.

## Early Stuff So Far
Plunder is coming along nicely but still needs a bit of love before it's really usable.

## See Plunder in action
Check out the [website](http://plunderjs.com) for live examples.

## Build Plunder and play with it via the sandbox
Here's what you need to do

1. clone this repo to your box
2. run `npm install` (you will need [npm](http://npmjs.org) installed)
3. run `grunt server:sandbox` to play with the sandbox

`sandbox/sandbox.coffee` is a truly minimal infrastructure to make Plunder possible.
Just a canvas and one entity that Plunder is manipulating. There are a few canned animation sequences defined
in the entity. You can uncomment the one you want to see run

```
# entity.standard()
# entity.bezier()
entity.nestedTween()
```

and those methods, `standard()`, `bezier()`, and `nestedTween` are decent intros to how Plunder works.

## Documentation

Plunder is actually pretty well documented, with much more to come. See the docs [here](http://city41.github.io/plunder/docs/index.html)

Really good docs are one thing I am really shooting for with Plunder.

## Contributing to Plunder
If you want to contribute then thank you, it's much appreciated!

Please fork the repo and send pull requests. Make sure to take advantage of the grunt tasks:

* `grunt` -- default task, runs the tests then builds Plunder
* `grunt spec` -- runs the tests
* `grunt build:sandbox` -- builds the sandbox
* `grunt server:sandbox` -- starts a server on `localhost:9000` with the sandbox served from there, then opens a browser to it

You can also see our [waffle board](http://waffle.io/city41/plunder) to get an idea of what needs to be worked on

## Plunder's Website
The [website](http://plunderjs.com) for Plunder now has its own repo, as it's gotten pretty involved. Check it out at http://github.com/city41/plunderSite  

The `gh-pages` branch here is now deprecated.

## Games Using Plunder

[Dragon Plunder](http://www.mattgreer.org/dragon-plunder/) -- this is the game Plunder was extracted from, hence the name.

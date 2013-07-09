define ->
  #	  Easing Equations v1.5
  #	  May 1, 2003
  #	  (c) 2003 Robert Penner, all rights reserved. 
  #	  This work is subject to the terms in http://www.robertpenner.com/easing_terms_of_use.html.  
  #	  
  #	  These tweening functions provide different flavors of 
  #	  math-based motion under a consistent API. 
  #	  
  #	  Types of easing:
  #	  
  #		  Linear
  #		  Quadratic
  #		  Cubic
  #		  Quartic
  #		  Quintic
  #		  Sinusoidal
  #		  Exponential
  #		  Circular
  #		  Elastic
  #		  Back
  #		  Bounce
  #
  #	  Changes:
  #	  mgreer -- converted to CoffeeScript
  #	  1.5 - added bounce easing
  #	  1.4 - added elastic and back easing
  #	  1.3 - tweaked the exponential easing functions to make endpoints exact
  #	  1.2 - inline optimizations (changing t and multiplying in one step)--thanks to Tatsuo Kato for the idea
  #	  
  #	  Discussed in Chapter 7 of 
  #	  Robert Penner's Programming Macromedia Flash MX
  #	  (including graphs of the easing equations)
  #	  
  #	  http://www.robertpenner.com/profmx
  #	  http://www.amazon.com/exec/obidos/ASIN/0072223561/robertpennerc-20
  #	
  Easing = 
    # simple linear tweening - no easing
    # t: current time, b: beginning value, c: change in value, d: duration
    linearTween: (t, b, c, d) ->
      c * t / d + b

    
    #/////////// QUADRATIC EASING: t^2 ///////////////////
    
    # quadratic easing in - accelerating from zero velocity
    # t: current time, b: beginning value, c: change in value, d: duration
    # t and d can be in frames or seconds/milliseconds
    easeInQuad: (t, b, c, d) ->
      c * (t /= d) * t + b

    
    # quadratic easing out - decelerating to zero velocity
    easeOutQuad: (t, b, c, d) ->
      -c * (t /= d) * (t - 2) + b

    
    # quadratic easing in/out - acceleration until halfway, then deceleration
    easeInOutQuad: (t, b, c, d) ->
      return c / 2 * t * t + b  if (t /= d / 2) < 1
      -c / 2 * ((--t) * (t - 2) - 1) + b

    
    #/////////// CUBIC EASING: t^3 ///////////////////////
    
    # cubic easing in - accelerating from zero velocity
    # t: current time, b: beginning value, c: change in value, d: duration
    # t and d can be frames or seconds/milliseconds
    easeInCubic: (t, b, c, d) ->
      c * (t /= d) * t * t + b

    
    # cubic easing out - decelerating to zero velocity
    easeOutCubic: (t, b, c, d) ->
      c * ((t: t / d - 1) * t * t + 1) + b

    
    # cubic easing in/out - acceleration until halfway, then deceleration
    easeInOutCubic: (t, b, c, d) ->
      return c / 2 * t * t * t + b  if (t /= d / 2) < 1
      c / 2 * ((t -= 2) * t * t + 2) + b

    
    #/////////// QUARTIC EASING: t^4 /////////////////////
    
    # quartic easing in - accelerating from zero velocity
    # t: current time, b: beginning value, c: change in value, d: duration
    # t and d can be frames or seconds/milliseconds
    easeInQuart: (t, b, c, d) ->
      c * (t /= d) * t * t * t + b

    
    # quartic easing out - decelerating to zero velocity
    easeOutQuart: (t, b, c, d) ->
      -c * ((t: t / d - 1) * t * t * t - 1) + b

    
    # quartic easing in/out - acceleration until halfway, then deceleration
    easeInOutQuart: (t, b, c, d) ->
      return c / 2 * t * t * t * t + b  if (t /= d / 2) < 1
      -c / 2 * ((t -= 2) * t * t * t - 2) + b

    
    #/////////// QUINTIC EASING: t^5  ////////////////////
    
    # quintic easing in - accelerating from zero velocity
    # t: current time, b: beginning value, c: change in value, d: duration
    # t and d can be frames or seconds/milliseconds
    easeInQuint: (t, b, c, d) ->
      c * (t /= d) * t * t * t * t + b

    
    # quintic easing out - decelerating to zero velocity
    easeOutQuint: (t, b, c, d) ->
      c * ((t: t / d - 1) * t * t * t * t + 1) + b

    
    # quintic easing in/out - acceleration until halfway, then deceleration
    easeInOutQuint: (t, b, c, d) ->
      return c / 2 * t * t * t * t * t + b  if (t /= d / 2) < 1
      c / 2 * ((t -= 2) * t * t * t * t + 2) + b

    
    #/////////// SINUSOIDAL EASING: sin(t) ///////////////
    
    # sinusoidal easing in - accelerating from zero velocity
    # t: current time, b: beginning value, c: change in position, d: duration
    easeInSine: (t, b, c, d) ->
      -c * Math.cos(t / d * (Math.PI / 2)) + c + b

    
    # sinusoidal easing out - decelerating to zero velocity
    easeOutSine: (t, b, c, d) ->
      c * Math.sin(t / d * (Math.PI / 2)) + b

    
    # sinusoidal easing in/out - accelerating until halfway, then decelerating
    easeInOutSine: (t, b, c, d) ->
      -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b

    
    #/////////// EXPONENTIAL EASING: 2^t /////////////////
    
    # exponential easing in - accelerating from zero velocity
    # t: current time, b: beginning value, c: change in position, d: duration
    easeInExpo: (t, b, c, d) ->
      (if (t is 0) then b else c * Math.pow(2, 10 * (t / d - 1)) + b)

    
    # exponential easing out - decelerating to zero velocity
    easeOutExpo: (t, b, c, d) ->
      (if (t is d) then b + c else c * (-Math.pow(2, -10 * t / d) + 1) + b)

    
    # exponential easing in/out - accelerating until halfway, then decelerating
    easeInOutExpo: (t, b, c, d) ->
      return b  if t is 0
      return b + c  if t is d
      return c / 2 * Math.pow(2, 10 * (t - 1)) + b  if (t /= d / 2) < 1
      c / 2 * (-Math.pow(2, -10 * --t) + 2) + b

    
    #///////// CIRCULAR EASING: sqrt(1-t^2) //////////////
    
    # circular easing in - accelerating from zero velocity
    # t: current time, b: beginning value, c: change in position, d: duration
    easeInCirc: (t, b, c, d) ->
      -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b

    
    # circular easing out - decelerating to zero velocity
    easeOutCirc: (t, b, c, d) ->
      c * Math.sqrt(1 - (t: t / d - 1) * t) + b

    
    # circular easing in/out - acceleration until halfway, then deceleration
    easeInOutCirc: (t, b, c, d) ->
      return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b  if (t /= d / 2) < 1
      c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b

    
    #///////// ELASTIC EASING: exponentially decaying sine wave  //////////////
    
    # t: current time, b: beginning value, c: change in value, d: duration, a: amplitude (optional), p: period (optional)
    # t and d can be in frames or seconds/milliseconds
    easeInElastic: (t, b, c, d, a, p) ->
      return b  if t is 0
      return b + c  if (t /= d) is 1
      p = d * .3  unless p
      if a < Math.abs(c)
        a = c
        s = p / 4
      else
        s = p / (2 * Math.PI) * Math.asin(c / a)
      -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b

    easeOutElastic: (t, b, c, d, a, p) ->
      return b  if t is 0
      return b + c  if (t /= d) is 1
      p = d * .3  unless p
      if a < Math.abs(c)
        a = c
        s = p / 4
      else
        s = p / (2 * Math.PI) * Math.asin(c / a)
      a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b

    easeInOutElastic: (t, b, c, d, a, p) ->
      return b  if t is 0
      return b + c  if (t /= d / 2) is 2
      p = d * (.3 * 1.5)  unless p
      if a < Math.abs(c)
        a = c
        s = p / 4
      else
        s = p / (2 * Math.PI) * Math.asin(c / a)
      return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b  if t < 1
      a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b

    
    #///////// BACK EASING: overshooting cubic easing: (s+1)*t^3 - s*t^2  //////////////
    
    # back easing in - backtracking slightly, then reversing direction and moving to target
    # t: current time, b: beginning value, c: change in value, d: duration, s: overshoot amount (optional)
    # t and d can be in frames or seconds/milliseconds
    # s controls the amount of overshoot: higher s means greater overshoot
    # s has a default value of 1.70158, which produces an overshoot of 10 percent
    # s==0 produces cubic easing with no overshoot
    easeInBack: (t, b, c, d, s) ->
      s = 1.70158  if s is `undefined`
      c * (t /= d) * t * ((s + 1) * t - s) + b

    
    # back easing out - moving towards target, overshooting it slightly, then reversing and coming back to target
    easeOutBack: (t, b, c, d, s) ->
      s = 1.70158  if s is `undefined`
      c * ((t: t / d - 1) * t * ((s + 1) * t + s) + 1) + b

    
    # back easing in/out - backtracking slightly, then reversing direction and moving to target,
    # then overshooting target, reversing, and finally coming back to target
    easeInOutBack: (t, b, c, d, s) ->
      s = 1.70158  if s is `undefined`
      return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b  if (t /= d / 2) < 1
      c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b

    
    #///////// BOUNCE EASING: exponentially decaying parabolic bounce  //////////////
    
    # bounce easing in
    # t: current time, b: beginning value, c: change in position, d: duration
    easeInBounce: (t, b, c, d) ->
      c - easeOutBounce(d - t, 0, c, d) + b

    
    # bounce easing out
    easeOutBounce: (t, b, c, d) ->
      if (t /= d) < (1 / 2.75)
        c * (7.5625 * t * t) + b
      else if t < (2 / 2.75)
        c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b
      else if t < (2.5 / 2.75)
        c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b
      else
        c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b

    
    # bounce easing in/out
    easeInOutBounce: (t, b, c, d) ->
      return easeInBounce(t * 2, 0, c, d) * .5 + b  if t < d / 2
      easeOutBounce(t * 2 - d, 0, c, d) * .5 + c * .5 + b


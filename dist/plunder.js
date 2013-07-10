(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof module === 'object'){
    module.exports = factory();
  } else {
    root.Plunder = factory();
  }
}(this, function () {

/**
 * almond 0.2.5 Copyright (c) 2011-2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*jslint sloppy: true */
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var main, req, makeMap, handlers,
        defined = {},
        waiting = {},
        config = {},
        defining = {},
        hasOwn = Object.prototype.hasOwnProperty,
        aps = [].slice;

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var nameParts, nameSegment, mapValue, foundMap,
            foundI, foundStarMap, starI, i, j, part,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name && name.charAt(0) === ".") {
            //If have a base name, try to normalize against it,
            //otherwise, assume it is a top-level require that will
            //be relative to baseUrl in the end.
            if (baseName) {
                //Convert baseName to array, and lop off the last part,
                //so that . matches that "directory" and not name of the baseName's
                //module. For instance, baseName of "one/two/three", maps to
                //"one/two/three.js", but we want the directory, "one/two" for
                //this normalization.
                baseParts = baseParts.slice(0, baseParts.length - 1);

                name = baseParts.concat(name.split("/"));

                //start trimDots
                for (i = 0; i < name.length; i += 1) {
                    part = name[i];
                    if (part === ".") {
                        name.splice(i, 1);
                        i -= 1;
                    } else if (part === "..") {
                        if (i === 1 && (name[2] === '..' || name[0] === '..')) {
                            //End of the line. Keep at least one non-dot
                            //path segment at the front so it can be mapped
                            //correctly to disk. Otherwise, there is likely
                            //no path mapping for a path starting with '..'.
                            //This can still fail, but catches the most reasonable
                            //uses of ..
                            break;
                        } else if (i > 0) {
                            name.splice(i - 1, 2);
                            i -= 2;
                        }
                    }
                }
                //end trimDots

                name = name.join("/");
            } else if (name.indexOf('./') === 0) {
                // No baseName, so this is ID is resolved relative
                // to baseUrl, pull off the leading dot.
                name = name.substring(2);
            }
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            return req.apply(undef, aps.call(arguments, 0).concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (hasProp(waiting, name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!hasProp(defined, name) && !hasProp(defining, name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    //Turns a plugin!resource to [plugin, resource]
    //with the plugin being undefined if the name
    //did not have a plugin prefix.
    function splitPrefix(name) {
        var prefix,
            index = name ? name.indexOf('!') : -1;
        if (index > -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }
        return [prefix, name];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    makeMap = function (name, relName) {
        var plugin,
            parts = splitPrefix(name),
            prefix = parts[0];

        name = parts[1];

        if (prefix) {
            prefix = normalize(prefix, relName);
            plugin = callDep(prefix);
        }

        //Normalize according
        if (prefix) {
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relName));
            } else {
                name = normalize(name, relName);
            }
        } else {
            name = normalize(name, relName);
            parts = splitPrefix(name);
            prefix = parts[0];
            name = parts[1];
            if (prefix) {
                plugin = callDep(prefix);
            }
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            pr: prefix,
            p: plugin
        };
    };

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    handlers = {
        require: function (name) {
            return makeRequire(name);
        },
        exports: function (name) {
            var e = defined[name];
            if (typeof e !== 'undefined') {
                return e;
            } else {
                return (defined[name] = {});
            }
        },
        module: function (name) {
            return {
                id: name,
                uri: '',
                exports: defined[name],
                config: makeConfig(name)
            };
        }
    };

    main = function (name, deps, callback, relName) {
        var cjsModule, depName, ret, map, i,
            args = [],
            usingExports;

        //Use name if no relName
        relName = relName || name;

        //Call the callback to define the module, if necessary.
        if (typeof callback === 'function') {

            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relName);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = handlers.require(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = handlers.exports(name);
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = handlers.module(name);
                } else if (hasProp(defined, depName) ||
                           hasProp(waiting, depName) ||
                           hasProp(defining, depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback.apply(defined[name], args);

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                        cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
        if (typeof deps === "string") {
            if (handlers[deps]) {
                //callback in this case is really relName
                return handlers[deps](callback);
            }
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, callback).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //If relName is a function, it is an errback handler,
        //so remove it.
        if (typeof relName === 'function') {
            relName = forceSync;
            forceSync = alt;
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            //Using a non-zero value because of concern for what old browsers
            //do, and latest browsers "upgrade" to 4 if lower value is used:
            //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
            //If want a value immediately, use require('id') instead -- something
            //that works in almond on the global level, but not guaranteed and
            //unlikely to work in other AMD implementations.
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 4);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        config = cfg;
        if (config.deps) {
            req(config.deps, config.callback);
        }
        return req;
    };

    define = function (name, deps, callback) {

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        if (!hasProp(defined, name) && !hasProp(waiting, name)) {
            waiting[name] = [name, deps, callback];
        }
    };

    define.amd = {
        jQuery: true
    };
}());

define("almond", function(){});

var __hasProp = {}.hasOwnProperty;

define('Util',[],function() {
  var Util, _isInteger;
  _isInteger = function(num) {
    return num === (num | 0);
  };
  Util = {
    rand: function(minOrMax, maxOrUndefined, dontFloor) {
      var max, min, range, result, shouldFloor;
      if (dontFloor == null) {
        dontFloor = false;
      }
      shouldFloor = !dontFloor;
      min = Util.isNumber(maxOrUndefined) ? minOrMax : 0;
      max = Util.isNumber(maxOrUndefined) ? maxOrUndefined : minOrMax;
      range = max - min;
      result = Math.random() * range + min;
      if (_isInteger(min) && _isInteger(max) && shouldFloor) {
        return Math.floor(result);
      } else {
        return result;
      }
    },
    coin: function() {
      return this.rand(0, 2) === 0;
    },
    degreesToRadians: function(degrees) {
      return degrees * Math.PI / 180;
    },
    radiansToDegrees: function(radians) {
      return radians * 180 / Math.PI;
    },
    isNumber: function(n) {
      return typeof n === "number";
    },
    isUndefined: function(obj) {
      return typeof obj === "undefined";
    },
    isFunction: function(f) {
      return typeof f === "function";
    },
    isString: function(s) {
      return toString.call(s) === "[object String]";
    },
    isPrimitive: function(o) {
      return o === true || o === false || this.isString(o) || this.isNumber(o);
    },
    areSameTypes: function(a, b) {
      if (this.isArray(a)) {
        return this.isArray(b);
      }
      if (this.isArray(b)) {
        return false;
      }
      return typeof a === typeof b;
    },
    extend: function(target, incoming) {
      var key, value;
      if (target != null) {
        for (key in incoming) {
          if (!__hasProp.call(incoming, key)) continue;
          value = incoming[key];
          target[key] = value;
        }
      }
      return target;
    },
    clone: function(obj) {
      if (!obj || this.isPrimitive(obj)) {
        return obj;
      }
      if (this.isArray(obj)) {
        return obj.slice(0);
      }
      return this.extend({}, obj);
    },
    toArray: function(obj) {
      if (obj == null) {
        return [];
      }
      if (this.isArray(obj)) {
        return obj;
      } else {
        return [obj];
      }
    },
    last: function(array) {
      return array && array[array.length - 1];
    },
    first: function(array) {
      return array && array[0];
    },
    isEmpty: function(array) {
      return array && array.length === 0;
    },
    any: function(array) {
      return array && array.length > 0;
    }
  };
  Util.isArray = Array.isArray || function(obj) {
    return toString.call(obj) === "[object Array]";
  };
  return Util;
});

define('Bezier',['./Util'], function(U) {
  var Bezier;
  return Bezier = (function() {
    function Bezier(config) {
      U.extend(this, config);
      this.reset();
    }

    Bezier.prototype.reset = function() {
      this._elapsed = 0;
      this.done = this._elapsed >= this.duration;
      return this._targetsInitted = false;
    };

    Bezier.prototype.reverse = function() {
      return new Bezier({
        targets: this.targets,
        points: this._reversePoints(this.points),
        duration: this.duration
      });
    };

    Bezier.prototype._reversePoints = function(points) {
      points = U.clone(points);
      this._swap(points, 0, 3);
      this._swap(points, 1, 2);
      return points;
    };

    Bezier.prototype._swap = function(array, a, b) {
      var temp;
      temp = array[a];
      array[a] = array[b];
      return array[b] = temp;
    };

    Bezier.prototype._initTargets = function() {
      var target, _i, _len, _ref;
      _ref = this.targets;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        target = _ref[_i];
        target.x = this.points[0].x;
        target.y = this.points[0].y;
      }
      return this._targetsInitted = true;
    };

    Bezier.prototype.update = function(delta) {
      var target, _i, _len, _ref, _results;
      if (this.done || this.disabled) {
        return;
      }
      if (!this._targetsInitted) {
        this._initTargets();
      }
      this._elapsed += delta;
      if (this._elapsed > this.duration) {
        this._elapsed = this.duration;
        return this.done = true;
      } else {
        _ref = this.targets;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          target = _ref[_i];
          _results.push(this._move(target));
        }
        return _results;
      }
    };

    Bezier.prototype._move = function(target) {
      var percent, x, y, _ref;
      percent = this._elapsed / this.duration;
      _ref = this._computeBezier(0, percent), x = _ref.x, y = _ref.y;
      target.x = x;
      return target.y = y;
    };

    Bezier.prototype._computeBezier = function(index, time) {
      var oneMinusT, oneMinusTCubed, p1, p2, p3, p4, t, tCubed, x, x1, x2, x3, x4, y, y1, y2, y3, y4;
      t = time;
      p1 = this.points[index];
      p2 = this.points[index + 1];
      p3 = this.points[index + 2];
      p4 = this.points[index + 3];
      oneMinusT = 1 - t;
      oneMinusTCubed = oneMinusT * oneMinusT * oneMinusT;
      tCubed = t * t * t;
      x1 = oneMinusTCubed * p1.x;
      x2 = 3 * t * oneMinusT * oneMinusT * p2.x;
      x3 = 3 * t * t * oneMinusT * p3.x;
      x4 = tCubed * p4.x;
      x = x1 + x2 + x3 + x4;
      y1 = oneMinusTCubed * p1.y;
      y2 = 3 * t * oneMinusT * oneMinusT * p2.y;
      y3 = 3 * t * t * oneMinusT * p3.y;
      y4 = tCubed * p4.y;
      y = y1 + y2 + y3 + y4;
      return {
        x: x,
        y: y
      };
    };

    return Bezier;

  })();
});

define('Easing',[],function() {
  var Easing;
  return Easing = {
    linearTween: function(t, b, c, d) {
      return c * t / d + b;
    },
    easeInQuad: function(t, b, c, d) {
      return c * (t /= d) * t + b;
    },
    easeOutQuad: function(t, b, c, d) {
      return -c * (t /= d) * (t - 2) + b;
    },
    easeInOutQuad: function(t, b, c, d) {
      if ((t /= d / 2) < 1) {
        return c / 2 * t * t + b;
      }
      return -c / 2 * ((--t) * (t - 2) - 1) + b;
    },
    easeInCubic: function(t, b, c, d) {
      return c * (t /= d) * t * t + b;
    },
    easeOutCubic: function(t, b, c, d) {
      return c * ({
        t: t / d - 1
      } * t * t + 1) + b;
    },
    easeInOutCubic: function(t, b, c, d) {
      if ((t /= d / 2) < 1) {
        return c / 2 * t * t * t + b;
      }
      return c / 2 * ((t -= 2) * t * t + 2) + b;
    },
    easeInQuart: function(t, b, c, d) {
      return c * (t /= d) * t * t * t + b;
    },
    easeOutQuart: function(t, b, c, d) {
      return -c * ({
        t: t / d - 1
      } * t * t * t - 1) + b;
    },
    easeInOutQuart: function(t, b, c, d) {
      if ((t /= d / 2) < 1) {
        return c / 2 * t * t * t * t + b;
      }
      return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
    },
    easeInQuint: function(t, b, c, d) {
      return c * (t /= d) * t * t * t * t + b;
    },
    easeOutQuint: function(t, b, c, d) {
      return c * ({
        t: t / d - 1
      } * t * t * t * t + 1) + b;
    },
    easeInOutQuint: function(t, b, c, d) {
      if ((t /= d / 2) < 1) {
        return c / 2 * t * t * t * t * t + b;
      }
      return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
    },
    easeInSine: function(t, b, c, d) {
      return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
    },
    easeOutSine: function(t, b, c, d) {
      return c * Math.sin(t / d * (Math.PI / 2)) + b;
    },
    easeInOutSine: function(t, b, c, d) {
      return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    },
    easeInExpo: function(t, b, c, d) {
      if (t === 0) {
        return b;
      } else {
        return c * Math.pow(2, 10 * (t / d - 1)) + b;
      }
    },
    easeOutExpo: function(t, b, c, d) {
      if (t === d) {
        return b + c;
      } else {
        return c * (-Math.pow(2, -10 * t / d) + 1) + b;
      }
    },
    easeInOutExpo: function(t, b, c, d) {
      if (t === 0) {
        return b;
      }
      if (t === d) {
        return b + c;
      }
      if ((t /= d / 2) < 1) {
        return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
      }
      return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
    },
    easeInCirc: function(t, b, c, d) {
      return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
    },
    easeOutCirc: function(t, b, c, d) {
      return c * Math.sqrt(1 - {
        t: t / d - 1
      } * t) + b;
    },
    easeInOutCirc: function(t, b, c, d) {
      if ((t /= d / 2) < 1) {
        return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
      }
      return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
    },
    easeInElastic: function(t, b, c, d, a, p) {
      var s;
      if (t === 0) {
        return b;
      }
      if ((t /= d) === 1) {
        return b + c;
      }
      if (!p) {
        p = d * .3;
      }
      if (a < Math.abs(c)) {
        a = c;
        s = p / 4;
      } else {
        s = p / (2 * Math.PI) * Math.asin(c / a);
      }
      return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    },
    easeOutElastic: function(t, b, c, d, a, p) {
      var s;
      if (t === 0) {
        return b;
      }
      if ((t /= d) === 1) {
        return b + c;
      }
      if (!p) {
        p = d * .3;
      }
      if (a < Math.abs(c)) {
        a = c;
        s = p / 4;
      } else {
        s = p / (2 * Math.PI) * Math.asin(c / a);
      }
      return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
    },
    easeInOutElastic: function(t, b, c, d, a, p) {
      var s;
      if (t === 0) {
        return b;
      }
      if ((t /= d / 2) === 2) {
        return b + c;
      }
      if (!p) {
        p = d * (.3 * 1.5);
      }
      if (a < Math.abs(c)) {
        a = c;
        s = p / 4;
      } else {
        s = p / (2 * Math.PI) * Math.asin(c / a);
      }
      if (t < 1) {
        return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
      }
      return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
    },
    easeInBack: function(t, b, c, d, s) {
      if (s === undefined) {
        s = 1.70158;
      }
      return c * (t /= d) * t * ((s + 1) * t - s) + b;
    },
    easeOutBack: function(t, b, c, d, s) {
      if (s === undefined) {
        s = 1.70158;
      }
      return c * ({
        t: t / d - 1
      } * t * ((s + 1) * t + s) + 1) + b;
    },
    easeInOutBack: function(t, b, c, d, s) {
      if (s === undefined) {
        s = 1.70158;
      }
      if ((t /= d / 2) < 1) {
        return c / 2 * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
      }
      return c / 2 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
    },
    easeInBounce: function(t, b, c, d) {
      return c - easeOutBounce(d - t, 0, c, d) + b;
    },
    easeOutBounce: function(t, b, c, d) {
      if ((t /= d) < (1 / 2.75)) {
        return c * (7.5625 * t * t) + b;
      } else if (t < (2 / 2.75)) {
        return c * (7.5625 * (t -= 1.5 / 2.75) * t + .75) + b;
      } else if (t < (2.5 / 2.75)) {
        return c * (7.5625 * (t -= 2.25 / 2.75) * t + .9375) + b;
      } else {
        return c * (7.5625 * (t -= 2.625 / 2.75) * t + .984375) + b;
      }
    },
    easeInOutBounce: function(t, b, c, d) {
      if (t < d / 2) {
        return easeInBounce(t * 2, 0, c, d) * .5 + b;
      }
      return easeOutBounce(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
    }
  };
});

define('Accessor',['./Util'], function(U) {
  var Accessor;
  return Accessor = {
    getProperty: function(obj, propertyPath) {
      var path, paths, _i, _len;
      paths = propertyPath.split(".");
      for (_i = 0, _len = paths.length; _i < _len; _i++) {
        path = paths[_i];
        obj = obj[path];
      }
      return obj;
    },
    setProperty: function(obj, propertyPath, value) {
      var i, paths, _i, _name, _ref;
      paths = propertyPath.split(".");
      for (i = _i = 0, _ref = paths.length - 1; _i < _ref; i = _i += 1) {
        if (obj[_name = paths[i]] == null) {
          obj[_name] = {};
        }
        obj = obj[paths[i]];
      }
      return obj[U.last(paths)] = value;
    },
    deleteProperty: function(obj, propertyPath) {
      var i, paths, _i, _ref;
      paths = propertyPath.split(".");
      for (i = _i = 0, _ref = paths.length - 1; _i < _ref; i = _i += 1) {
        if (!obj[paths[i]]) {
          return;
        }
        obj = obj[paths[i]];
      }
      return delete obj[U.last(paths)];
    }
  };
});

define('Tween',['./Easing', './Util', './Accessor'], function(Easing, U, A) {
  var Tween, _idCounter;
  _idCounter = 0;
  return Tween = (function() {
    function Tween(config) {
      U.extend(this, config);
      this._saveProperty = this.property + "_save_" + (_idCounter++);
      this.easeFunc = Easing[this.easing || "linearTween"] || Easing.linearTween;
      this.reset();
    }

    Tween.prototype.reset = function() {
      this._elapsed = 0;
      this.done = this._elapsed >= this.duration;
      return this._targetsInitted = false;
    };

    Tween.prototype.reverse = function() {
      return new Tween({
        property: this.property,
        targets: this.targets,
        from: this.to,
        to: this.from,
        easing: this.easing,
        duration: this.duration
      });
    };

    Tween.prototype._initTargets = function() {
      var curValue, target, value, _i, _len, _ref;
      _ref = this.targets;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        target = _ref[_i];
        curValue = A.getProperty(target, this.property);
        if (U.isArray(curValue)) {
          A.setProperty(target, this._saveProperty, curValue.slice(0));
        } else {
          A.setProperty(target, this._saveProperty, curValue);
        }
        value = this.from != null ? this.from : target[this.property];
        if ((curValue != null) && (!U.areSameTypes(value, curValue) || !U.areSameTypes(value, this.to))) {
          throw new Error("Tween: mismatched types between from/to and targets current value");
        }
        if (U.isArray(value)) {
          value = value.slice(0);
        }
        A.setProperty(target, this.property, value);
      }
      return this._targetsInitted = true;
    };

    Tween.prototype.update = function(delta) {
      var target, _i, _len, _ref;
      if (this.done || this.disabled) {
        return;
      }
      if (!this._targetsInitted) {
        this._initTargets();
      }
      this._elapsed += delta;
      if (this._elapsed >= this.duration) {
        this._elapsed = this.duration;
        this.done = true;
      } else {
        _ref = this.targets;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          target = _ref[_i];
          this._tween(target);
        }
      }
      if (this.done) {
        return this._finish();
      }
    };

    Tween.prototype._finish = function() {
      var finalValue, target, _i, _len, _ref, _results;
      _ref = this.targets;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        target = _ref[_i];
        finalValue = this.restoreAfter ? A.getProperty(target, this._saveProperty) : this.to;
        A.setProperty(target, this.property, finalValue);
        _results.push(A.deleteProperty(target, this._saveProperty));
      }
      return _results;
    };

    Tween.prototype._tween = function(target) {
      var cell, curValue, from, i, tweenedValue, _i, _len, _results;
      curValue = A.getProperty(target, this.property);
      if (U.isArray(curValue)) {
        _results = [];
        for (i = _i = 0, _len = curValue.length; _i < _len; i = ++_i) {
          cell = curValue[i];
          from = this.from || target[this._saveProperty];
          _results.push(curValue[i] = this._tweenValue(this._elapsed, from[i], this.to[i], this.duration));
        }
        return _results;
      } else if (U.isNumber(curValue)) {
        tweenedValue = this._tweenValue(this._elapsed, this.from, this.to, this.duration);
        return A.setProperty(target, this.property, tweenedValue);
      } else {
        throw new Error("Tween can only operate on numbers or arrays of numbers");
      }
    };

    Tween.prototype._tweenValue = function(elapsed, from, to, duration) {
      var position;
      position = this.easeFunc(elapsed, from, to - from, duration);
      return position;
    };

    return Tween;

  })();
});

define('Wait',['./Util'], function(U) {
  var Wait;
  return Wait = (function() {
    function Wait(config) {
      U.extend(this, config);
      if ((this.min != null) && (this.max != null) && this.min > this.max) {
        throw new Error("Wait: min must be less than max");
      }
      this._specifiedDuration = this.duration;
      this.reset();
    }

    Wait.prototype.reverse = function() {
      return new Wait({
        duration: this.duration
      });
    };

    Wait.prototype.reset = function() {
      this.duration = this._specifiedDuration || U.rand(this.min, this.max);
      this._elapsed = 0;
      return this.done = this._elapsed >= this.duration;
    };

    Wait.prototype.update = function(delta) {
      if (this.done) {
        return;
      }
      this._elapsed += delta;
      return this.done = this._elapsed >= this.duration;
    };

    return Wait;

  })();
});

var __slice = [].slice;

define('Repeat',["./Util"], function(U) {
  var Repeat;
  return Repeat = (function() {
    function Repeat(count, children) {
      this.count = count;
      this.children = children != null ? children : [];
      this._currentChild = 0;
      this._curCount = 0;
    }

    Repeat.prototype.reset = function() {
      var child, _i, _len, _ref, _results;
      this.done = false;
      this._currentChild = 0;
      this._curCount = 0;
      _ref = this.children;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        _results.push(child.reset());
      }
      return _results;
    };

    Repeat.prototype.reverse = function() {
      var child, reversedChildren;
      reversedChildren = (function() {
        var _i, _len, _ref, _results;
        _ref = this.children;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          child = _ref[_i];
          _results.push(child.reverse());
        }
        return _results;
      }).call(this);
      return new Repeat(this.count, reversedChildren.reverse());
    };

    Repeat.prototype.update = function() {
      var args, child, curChild, _i, _len, _ref, _results;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      this.done = this._curCount >= this.count;
      if (this.done) {
        return;
      }
      curChild = this.children[this._currentChild];
      curChild.update.apply(curChild, args);
      if (curChild.done) {
        ++this._currentChild;
        if (this._currentChild >= this.children.length) {
          this._currentChild = 0;
          ++this._curCount;
          this.done = this._curCount >= this.count;
          if (!this.done) {
            _ref = this.children;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              child = _ref[_i];
              _results.push(child.reset());
            }
            return _results;
          }
        }
      }
    };

    return Repeat;

  })();
});

var __slice = [].slice;

define('Together',[],function() {
  var Together;
  return Together = (function() {
    function Together(children) {
      this.children = children != null ? children : [];
    }

    Together.prototype.reset = function() {
      var child, _i, _len, _ref, _results;
      this.done = false;
      _ref = this.children;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        _results.push(child.reset());
      }
      return _results;
    };

    Together.prototype.reverse = function() {
      var child, reversedChildren;
      reversedChildren = (function() {
        var _i, _len, _ref, _results;
        _ref = this.children;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          child = _ref[_i];
          _results.push(child.reverse());
        }
        return _results;
      }).call(this);
      return new Together(reversedChildren);
    };

    Together.prototype.update = function() {
      var args, child, childNotDone, _i, _len, _ref;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (this.done) {
        return;
      }
      childNotDone = false;
      _ref = this.children;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        child.update.apply(child, args);
        if (!child.done) {
          childNotDone = true;
        }
      }
      return this.done = !childNotDone;
    };

    return Together;

  })();
});

define('Invoke',['./Util'], function(U) {
  var Invoke;
  return Invoke = (function() {
    function Invoke(config) {
      U.extend(this, config);
      this.reset();
    }

    Invoke.prototype.reset = function() {
      return this.done = false;
    };

    Invoke.prototype.reverse = function() {
      return new Invoke({
        func: this.func,
        context: this.context
      });
    };

    Invoke.prototype.update = function() {
      if (this.done) {
        return;
      }
      this.func.call(this.context);
      return this.done = true;
    };

    return Invoke;

  })();
});

define('Timeline',["./Util", "./Bezier", "./Tween", "./Wait", "./Repeat", "./Together", "./Invoke"], function(U, Bezier, Tween, Wait, Repeat, Together, Invoke) {
  var Timeline;
  return Timeline = (function() {
    function Timeline(owner) {
      this.owner = owner;
      if (!this.owner) {
        throw new Error("Timeline requires an owner");
      }
      this._buildStack = [];
      this._childConfigStack = [];
    }

    Timeline.prototype._getTargets = function(targetOptions) {
      var targets, _ref;
      targets = (_ref = targetOptions.target) != null ? _ref : this.owner;
      return U.toArray(targets);
    };

    Timeline.prototype._mergeConfig = function(config) {
      if (U.any(this._childConfigStack)) {
        return U.extend(U.clone(U.last(this._childConfigStack)), config);
      } else {
        return config;
      }
    };

    Timeline.prototype._addParentAnimation = function(childConfigOrBuilder, builderOrUndefined, AniConstructor, consArg) {
      var builder, childConfig, parentAni;
      if (U.isFunction(childConfigOrBuilder)) {
        builder = childConfigOrBuilder;
      } else {
        childConfig = childConfigOrBuilder;
        builder = builderOrUndefined;
      }
      parentAni = new AniConstructor(consArg);
      if (childConfig) {
        this._childConfigStack.push(childConfig);
      }
      this._buildStack.push(parentAni);
      builder(this);
      this._buildStack.pop();
      if (childConfig) {
        this._childConfigStack.pop();
      }
      return this._pushAnimation(parentAni);
    };

    Timeline.prototype._addAnimation = function(AniConstructor, config) {
      var ani;
      ani = new AniConstructor(this._mergeConfig(config));
      ani.targets = this._getTargets(ani);
      return this._pushAnimation(ani);
    };

    Timeline.prototype._pushAnimation = function(ani) {
      if (this._buildStack.length === 0) {
        this.owner.addAni(ani);
      } else {
        this._buildStack[this._buildStack.length - 1].children.push(ani);
      }
      return ani;
    };

    Timeline.prototype._fade = function(config, from, to) {
      if (U.isNumber(config)) {
        config = {
          duration: config
        };
      }
      config.property = "alpha";
      config.from = from;
      config.to = to;
      return this._addAnimation(Tween, config);
    };

    Timeline.prototype.reverse = function(ani) {
      return this._pushAnimation(ani.reverse());
    };

    Timeline.prototype.setProperty = function(config) {
      if (config == null) {
        config = {};
      }
      config.duration = 0;
      config.from = config.to = config.value;
      return this.tween(config);
    };

    Timeline.prototype.bezier = function(config) {
      if (config == null) {
        config = {};
      }
      return this._addAnimation(Bezier, config);
    };

    Timeline.prototype.tween = function(config) {
      if (config == null) {
        config = {};
      }
      return this._addAnimation(Tween, config);
    };

    Timeline.prototype.fadeIn = function(config) {
      if (config == null) {
        config = {};
      }
      return this._fade(config, 0, 1);
    };

    Timeline.prototype.fadeOut = function(config) {
      if (config == null) {
        config = {};
      }
      return this._fade(config, 1, 0);
    };

    Timeline.prototype.scale = function(config) {
      if (config == null) {
        config = {};
      }
      config.property = 'scale';
      return this.tween(config);
    };

    Timeline.prototype.color = function(config) {
      if (config == null) {
        config = {};
      }
      config.property = 'color';
      return this.tween(config);
    };

    Timeline.prototype.rotate = function(config) {
      if (config == null) {
        config = {};
      }
      config.property = 'angle';
      return this.tween(config);
    };

    Timeline.prototype.move = function(config) {
      var xconfig, yconfig, _ref, _ref1;
      xconfig = U.clone(config);
      xconfig.easing = (_ref = config.easingX) != null ? _ref : config.easing;
      xconfig.from = config.from.x;
      xconfig.to = config.to.x;
      xconfig.property = 'x';
      yconfig = U.clone(config);
      yconfig.easing = (_ref1 = config.easingY) != null ? _ref1 : config.easing;
      yconfig.from = config.from.y;
      yconfig.to = config.to.y;
      yconfig.property = 'y';
      return this.together(function(tl) {
        tl.tween(xconfig);
        return tl.tween(yconfig);
      });
    };

    Timeline.prototype.together = function(childConfigOrBuilder, builderOrUndefined) {
      return this._addParentAnimation(childConfigOrBuilder, builderOrUndefined, Together);
    };

    Timeline.prototype.sequence = function(childConfigOrBuilder, builderOrUndefined) {
      return this.repeat(1, childConfigOrBuilder, builderOrUndefined);
    };

    Timeline.prototype.forever = function(childConfigOrBuilder, builderOrUndefined) {
      return this.repeat(Infinity, childConfigOrBuilder, builderOrUndefined);
    };

    Timeline.prototype.repeat = function(count, childConfigOrBuilder, builderOrUndefined) {
      return this._addParentAnimation(childConfigOrBuilder, builderOrUndefined, Repeat, count);
    };

    Timeline.prototype.wait = function(duration) {
      return this.waitBetween(duration, duration);
    };

    Timeline.prototype.waitBetween = function(min, max) {
      return this._addAnimation(Wait, {
        min: min,
        max: max
      });
    };

    Timeline.prototype.invoke = function(func, context) {
      return this._addAnimation(Invoke, {
        func: func,
        context: context
      });
    };

    Timeline.prototype.stop = function() {
      return this.owner.clearAnis();
    };

    return Timeline;

  })();
});

define('main',["./Timeline", "./Util", "./Bezier", "./Easing", "./Invoke", "./Repeat", "./Together", "./Tween", "./Wait"], function(Timeline, Util, Bezier, Easing, Invoke, Repeat, Together, Tween, Wait) {
  return {
    Timeline: Timeline,
    Util: Util,
    Bezier: Bezier,
    Easing: Easing,
    Invoke: Invoke,
    Repeat: Repeat,
    Together: Together,
    Tween: Tween,
    Wait: Wait
  };
});
  return require('main');
}));
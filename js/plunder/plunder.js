/**
 * almond 0.2.5 Copyright (c) 2011-2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */

var requirejs,require,define;(function(e){function c(e,t){return f.call(e,t)}function h(e,t){var n,r,i,s,o,a,f,l,c,h,p=t&&t.split("/"),d=u.map,v=d&&d["*"]||{};if(e&&e.charAt(0)===".")if(t){p=p.slice(0,p.length-1),e=p.concat(e.split("/"));for(l=0;l<e.length;l+=1){h=e[l];if(h===".")e.splice(l,1),l-=1;else if(h===".."){if(l===1&&(e[2]===".."||e[0]===".."))break;l>0&&(e.splice(l-1,2),l-=2)}}e=e.join("/")}else e.indexOf("./")===0&&(e=e.substring(2));if((p||v)&&d){n=e.split("/");for(l=n.length;l>0;l-=1){r=n.slice(0,l).join("/");if(p)for(c=p.length;c>0;c-=1){i=d[p.slice(0,c).join("/")];if(i){i=i[r];if(i){s=i,o=l;break}}}if(s)break;!a&&v&&v[r]&&(a=v[r],f=l)}!s&&a&&(s=a,o=f),s&&(n.splice(0,o,s),e=n.join("/"))}return e}function p(t,r){return function(){return n.apply(e,l.call(arguments,0).concat([t,r]))}}function d(e){return function(t){return h(t,e)}}function v(e){return function(t){s[e]=t}}function m(n){if(c(o,n)){var r=o[n];delete o[n],a[n]=!0,t.apply(e,r)}if(!c(s,n)&&!c(a,n))throw new Error("No "+n);return s[n]}function g(e){var t,n=e?e.indexOf("!"):-1;return n>-1&&(t=e.substring(0,n),e=e.substring(n+1,e.length)),[t,e]}function y(e){return function(){return u&&u.config&&u.config[e]||{}}}var t,n,r,i,s={},o={},u={},a={},f=Object.prototype.hasOwnProperty,l=[].slice;r=function(e,t){var n,r=g(e),i=r[0];return e=r[1],i&&(i=h(i,t),n=m(i)),i?n&&n.normalize?e=n.normalize(e,d(t)):e=h(e,t):(e=h(e,t),r=g(e),i=r[0],e=r[1],i&&(n=m(i))),{f:i?i+"!"+e:e,n:e,pr:i,p:n}},i={require:function(e){return p(e)},exports:function(e){var t=s[e];return typeof t!="undefined"?t:s[e]={}},module:function(e){return{id:e,uri:"",exports:s[e],config:y(e)}}},t=function(t,n,u,f){var l,h,d,g,y,b=[],w;f=f||t;if(typeof u=="function"){n=!n.length&&u.length?["require","exports","module"]:n;for(y=0;y<n.length;y+=1){g=r(n[y],f),h=g.f;if(h==="require")b[y]=i.require(t);else if(h==="exports")b[y]=i.exports(t),w=!0;else if(h==="module")l=b[y]=i.module(t);else if(c(s,h)||c(o,h)||c(a,h))b[y]=m(h);else{if(!g.p)throw new Error(t+" missing "+h);g.p.load(g.n,p(f,!0),v(h),{}),b[y]=s[h]}}d=u.apply(s[t],b);if(t)if(l&&l.exports!==e&&l.exports!==s[t])s[t]=l.exports;else if(d!==e||!w)s[t]=d}else t&&(s[t]=u)},requirejs=require=n=function(s,o,a,f,l){return typeof s=="string"?i[s]?i[s](o):m(r(s,o).f):(s.splice||(u=s,o.splice?(s=o,o=a,a=null):s=e),o=o||function(){},typeof a=="function"&&(a=f,f=l),f?t(e,s,o,a):setTimeout(function(){t(e,s,o,a)},4),n)},n.config=function(e){return u=e,u.deps&&n(u.deps,u.callback),n},define=function(e,t,n){t.splice||(n=t,t=[]),!c(s,e)&&!c(o,e)&&(o[e]=[e,t,n])},define.amd={jQuery:!0}})(),define("almond",function(){});var __hasProp={}.hasOwnProperty;define("Util",[],function(){var e,t;return t=function(e){return e===(e|0)},e={rand:function(n,r,i){var s,o,u,a,f;return i==null&&(i=!1),f=!i,o=e.isNumber(r)?n:0,s=e.isNumber(r)?r:n,u=s-o,a=Math.random()*u+o,t(o)&&t(s)&&f?Math.floor(a):a},coin:function(){return this.rand(0,2)===0},degreesToRadians:function(e){return e*Math.PI/180},radiansToDegrees:function(e){return e*180/Math.PI},isNumber:function(e){return typeof e=="number"},isUndefined:function(e){return typeof e=="undefined"},isFunction:function(e){return typeof e=="function"},isString:function(e){return toString.call(e)==="[object String]"},isPrimitive:function(e){return e===!0||e===!1||this.isString(e)||this.isNumber(e)},areSameTypes:function(e,t){return this.isArray(e)?this.isArray(t):this.isArray(t)?!1:typeof e==typeof t},extend:function(e,t){var n,r;if(e!=null)for(n in t){if(!__hasProp.call(t,n))continue;r=t[n],e[n]=r}return e},clone:function(e){return!e||this.isPrimitive(e)?e:this.isArray(e)?e.slice(0):this.extend({},e)},toArray:function(e){return e==null?[]:this.isArray(e)?e:[e]},last:function(e){return e&&e[e.length-1]},first:function(e){return e&&e[0]},isEmpty:function(e){return e&&e.length===0},any:function(e){return e&&e.length>0}},e.isArray=Array.isArray||function(e){return toString.call(e)==="[object Array]"},e}),define("Bezier",["Util"],function(e){var t;return t=function(){function t(t){e.extend(this,t),this.reset()}return t.prototype.reset=function(){return this._elapsed=0,this.done=this._elapsed>=this.duration,this._targetsInitted=!1},t.prototype.reverse=function(){return new t({targets:this.targets,points:this._reversePoints(this.points),duration:this.duration})},t.prototype._reversePoints=function(t){return t=e.clone(t),this._swap(t,0,3),this._swap(t,1,2),t},t.prototype._swap=function(e,t,n){var r;return r=e[t],e[t]=e[n],e[n]=r},t.prototype._initTargets=function(){var e,t,n,r;r=this.targets;for(t=0,n=r.length;t<n;t++)e=r[t],e.x=this.points[0].x,e.y=this.points[0].y;return this._targetsInitted=!0},t.prototype.update=function(e){var t,n,r,i,s;if(this.done||this.disabled)return;this._targetsInitted||this._initTargets(),this._elapsed+=e;if(this._elapsed>this.duration)return this._elapsed=this.duration,this.done=!0;i=this.targets,s=[];for(n=0,r=i.length;n<r;n++)t=i[n],s.push(this._move(t));return s},t.prototype._move=function(e){var t,n,r,i;return t=this._elapsed/this.duration,i=this._computeBezier(0,t),n=i.x,r=i.y,e.x=n,e.y=r},t.prototype._computeBezier=function(e,t){var n,r,i,s,o,u,a,f,l,c,h,p,d,v,m,g,y,b;return a=t,i=this.points[e],s=this.points[e+1],o=this.points[e+2],u=this.points[e+3],n=1-a,r=n*n*n,f=a*a*a,c=r*i.x,h=3*a*n*n*s.x,p=3*a*a*n*o.x,d=f*u.x,l=c+h+p+d,m=r*i.y,g=3*a*n*n*s.y,y=3*a*a*n*o.y,b=f*u.y,v=m+g+y+b,{x:l,y:v}},t}()}),define("Easing",[],function(){var e;return e={linearTween:function(e,t,n,r){return n*e/r+t},easeInQuad:function(e,t,n,r){return n*(e/=r)*e+t},easeOutQuad:function(e,t,n,r){return-n*(e/=r)*(e-2)+t},easeInOutQuad:function(e,t,n,r){return(e/=r/2)<1?n/2*e*e+t:-n/2*(--e*(e-2)-1)+t},easeInCubic:function(e,t,n,r){return n*(e/=r)*e*e+t},easeOutCubic:function(e,t,n,r){return n*({t:e/r-1}*e*e+1)+t},easeInOutCubic:function(e,t,n,r){return(e/=r/2)<1?n/2*e*e*e+t:n/2*((e-=2)*e*e+2)+t},easeInQuart:function(e,t,n,r){return n*(e/=r)*e*e*e+t},easeOutQuart:function(e,t,n,r){return-n*({t:e/r-1}*e*e*e-1)+t},easeInOutQuart:function(e,t,n,r){return(e/=r/2)<1?n/2*e*e*e*e+t:-n/2*((e-=2)*e*e*e-2)+t},easeInQuint:function(e,t,n,r){return n*(e/=r)*e*e*e*e+t},easeOutQuint:function(e,t,n,r){return n*({t:e/r-1}*e*e*e*e+1)+t},easeInOutQuint:function(e,t,n,r){return(e/=r/2)<1?n/2*e*e*e*e*e+t:n/2*((e-=2)*e*e*e*e+2)+t},easeInSine:function(e,t,n,r){return-n*Math.cos(e/r*(Math.PI/2))+n+t},easeOutSine:function(e,t,n,r){return n*Math.sin(e/r*(Math.PI/2))+t},easeInOutSine:function(e,t,n,r){return-n/2*(Math.cos(Math.PI*e/r)-1)+t},easeInExpo:function(e,t,n,r){return e===0?t:n*Math.pow(2,10*(e/r-1))+t},easeOutExpo:function(e,t,n,r){return e===r?t+n:n*(-Math.pow(2,-10*e/r)+1)+t},easeInOutExpo:function(e,t,n,r){return e===0?t:e===r?t+n:(e/=r/2)<1?n/2*Math.pow(2,10*(e-1))+t:n/2*(-Math.pow(2,-10*--e)+2)+t},easeInCirc:function(e,t,n,r){return-n*(Math.sqrt(1-(e/=r)*e)-1)+t},easeOutCirc:function(e,t,n,r){return n*Math.sqrt(1-{t:e/r-1}*e)+t},easeInOutCirc:function(e,t,n,r){return(e/=r/2)<1?-n/2*(Math.sqrt(1-e*e)-1)+t:n/2*(Math.sqrt(1-(e-=2)*e)+1)+t},easeInElastic:function(e,t,n,r,i,s){var o;return e===0?t:(e/=r)===1?t+n:(s||(s=r*.3),i<Math.abs(n)?(i=n,o=s/4):o=s/(2*Math.PI)*Math.asin(n/i),-(i*Math.pow(2,10*(e-=1))*Math.sin((e*r-o)*2*Math.PI/s))+t)},easeOutElastic:function(e,t,n,r,i,s){var o;return e===0?t:(e/=r)===1?t+n:(s||(s=r*.3),i<Math.abs(n)?(i=n,o=s/4):o=s/(2*Math.PI)*Math.asin(n/i),i*Math.pow(2,-10*e)*Math.sin((e*r-o)*2*Math.PI/s)+n+t)},easeInOutElastic:function(e,t,n,r,i,s){var o;return e===0?t:(e/=r/2)===2?t+n:(s||(s=r*.3*1.5),i<Math.abs(n)?(i=n,o=s/4):o=s/(2*Math.PI)*Math.asin(n/i),e<1?-0.5*i*Math.pow(2,10*(e-=1))*Math.sin((e*r-o)*2*Math.PI/s)+t:i*Math.pow(2,-10*(e-=1))*Math.sin((e*r-o)*2*Math.PI/s)*.5+n+t)},easeInBack:function(e,t,n,r,i){return i===undefined&&(i=1.70158),n*(e/=r)*e*((i+1)*e-i)+t},easeOutBack:function(e,t,n,r,i){return i===undefined&&(i=1.70158),n*({t:e/r-1}*e*((i+1)*e+i)+1)+t},easeInOutBack:function(e,t,n,r,i){return i===undefined&&(i=1.70158),(e/=r/2)<1?n/2*e*e*(((i*=1.525)+1)*e-i)+t:n/2*((e-=2)*e*(((i*=1.525)+1)*e+i)+2)+t},easeInBounce:function(e,t,n,r){return n-easeOutBounce(r-e,0,n,r)+t},easeOutBounce:function(e,t,n,r){return(e/=r)<1/2.75?n*7.5625*e*e+t:e<2/2.75?n*(7.5625*(e-=1.5/2.75)*e+.75)+t:e<2.5/2.75?n*(7.5625*(e-=2.25/2.75)*e+.9375)+t:n*(7.5625*(e-=2.625/2.75)*e+.984375)+t},easeInOutBounce:function(e,t,n,r){return e<r/2?easeInBounce(e*2,0,n,r)*.5+t:easeOutBounce(e*2-r,0,n,r)*.5+n*.5+t}}}),define("Tween",["Easing","Util"],function(e,t){var n,r;return r=0,n=function(){function n(n){t.extend(this,n),this._saveProperty=this.property+"_save_"+r++,this._nonJitteredProperty=this.property+"_nonJittered_"+r++,this.easeFunc=e[this.easing||"linearTween"]||e.linearTween,this.reset()}return n.prototype.reset=function(){return this._elapsed=0,this.done=this._elapsed>=this.duration,this._targetsInitted=!1},n.prototype.reverse=function(){return new n({property:this.property,targets:this.targets,from:this.to,to:this.from,easing:this.easing,duration:this.duration})},n.prototype._initTargets=function(){var e,n,r,i,s,o;o=this.targets;for(i=0,s=o.length;i<s;i++){n=o[i],e=this._getProperty(n,this.property),t.isArray(e)?this._setProperty(n,this._saveProperty,e.slice(0)):this._setProperty(n,this._saveProperty,e),r=this.from!=null?this.from:n[this.property];if(e!=null&&(!t.areSameTypes(r,e)||!t.areSameTypes(r,this.to)))throw new Error("Tween: mismatched types between from/to and targets current value");t.isArray(r)&&(r=r.slice(0)),this._setProperty(n,this.property,r)}return this._targetsInitted=!0},n.prototype.update=function(e){var t,n,r,i;if(this.done||this.disabled)return;this._targetsInitted||this._initTargets(),this._elapsed+=e;if(this._elapsed>=this.duration)this._elapsed=this.duration,this.done=!0;else{i=this.targets;for(n=0,r=i.length;n<r;n++)t=i[n],this._tween(t)}if(this.done)return this._finish()},n.prototype._finish=function(){var e,t,n,r,i,s;i=this.targets,s=[];for(n=0,r=i.length;n<r;n++)t=i[n],e=this.restoreAfter?this._getProperty(t,this._saveProperty):this.to,this._setProperty(t,this.property,e),this._deleteProperty(t,this._saveProperty),s.push(this._deleteProperty(t,this._nonJitteredProperty));return s},n.prototype._getProperty=function(e,t){var n,r,i,s;r=t.split(".");for(i=0,s=r.length;i<s;i++)n=r[i],e=e[n];return e},n.prototype._setProperty=function(e,t,n){var r,i,s,o;i=t.split(".");for(r=s=0,o=i.length-1;s<o;r=s+=1)e=e[i[r]];return e[i[i.length-1]]=n},n.prototype._deleteProperty=function(e,t){var n,r,i,s;r=t.split(".");for(n=i=0,s=r.length-1;i<s;n=i+=1)e=e[r[n]];return delete e[r[r.length-1]]},n.prototype._tween=function(e){var n,r,i,s,o,u,a,f;r=this._getProperty(e,this.property);if(t.isArray(r)){f=[];for(s=u=0,a=r.length;u<a;s=++u)n=r[s],i=this.from||e[this._saveProperty],f.push(r[s]=this._tweenValue(this._elapsed,i[s],this.to[s],this.duration));return f}if(t.isNumber(r))return o=this._tweenValue(this._elapsed,this.from,this.to,this.duration),this._setProperty(e,this.property,o);throw new Error("Tween can only operate on numbers or arrays of numbers")},n.prototype._tweenValue=function(e,n,r,i){var s;return s=this.easeFunc(e,n,r-n,i),t.isNumber(this.jitterMin)&&(s+=t.rand(this.jitterMin,this.jitterMax||0)),s},n}()}),define("Wait",["Util"],function(e){var t;return t=function(){function t(t){e.extend(this,t);if(this.min!=null&&this.max!=null&&this.min>this.max)throw new Error("Wait: min must be less than max");this._specifiedDuration=this.duration,this.reset()}return t.prototype.reverse=function(){return new t({duration:this.duration})},t.prototype.reset=function(){return this.duration=this._specifiedDuration||e.rand(this.min,this.max),this._elapsed=0,this.done=this._elapsed>=this.duration},t.prototype.update=function(e){if(this.done)return;return this._elapsed+=e,this.done=this._elapsed>=this.duration},t}()});var __slice=[].slice;define("Repeat",["Util"],function(e){var t;return t=function(){function e(e,t){this.count=e,this.children=t!=null?t:[],this._currentChild=0,this._curCount=0}return e.prototype.reset=function(){var e,t,n,r,i;this.done=!1,this._currentChild=0,this._curCount=0,r=this.children,i=[];for(t=0,n=r.length;t<n;t++)e=r[t],i.push(e.reset());return i},e.prototype.reverse=function(){var t,n;return n=function(){var e,n,r,i;r=this.children,i=[];for(e=0,n=r.length;e<n;e++)t=r[e],i.push(t.reverse());return i}.call(this),new e(this.count,n.reverse())},e.prototype.update=function(){var e,t,n,r,i,s,o;e=1<=arguments.length?__slice.call(arguments,0):[],this.done=this._curCount>=this.count;if(this.done)return;n=this.children[this._currentChild],n.update.apply(n,e);if(n.done){++this._currentChild;if(this._currentChild>=this.children.length){this._currentChild=0,++this._curCount,this.done=this._curCount>=this.count;if(!this.done){s=this.children,o=[];for(r=0,i=s.length;r<i;r++)t=s[r],o.push(t.reset());return o}}}},e}()});var __slice=[].slice;define("Together",[],function(){var e;return e=function(){function e(e){this.children=e!=null?e:[]}return e.prototype.reset=function(){var e,t,n,r,i;this.done=!1,r=this.children,i=[];for(t=0,n=r.length;t<n;t++)e=r[t],i.push(e.reset());return i},e.prototype.reverse=function(){var t,n;return n=function(){var e,n,r,i;r=this.children,i=[];for(e=0,n=r.length;e<n;e++)t=r[e],i.push(t.reverse());return i}.call(this),new e(n)},e.prototype.update=function(){var e,t,n,r,i,s;e=1<=arguments.length?__slice.call(arguments,0):[];if(this.done)return;n=!1,s=this.children;for(r=0,i=s.length;r<i;r++)t=s[r],t.update.apply(t,e),t.done||(n=!0);return this.done=!n},e}()}),define("Invoke",["Util"],function(e){var t;return t=function(){function t(t){e.extend(this,t),this.reset()}return t.prototype.reset=function(){return this.done=!1},t.prototype.reverse=function(){return new t({func:this.func,context:this.context})},t.prototype.update=function(){if(this.done)return;return this.func.call(this.context),this.done=!0},t}()}),define("Timeline",["Util","Bezier","Tween","Wait","Repeat","Together","Invoke"],function(e,t,n,r,i,s,o){var u;return u=function(){function u(e){this.owner=e;if(!this.owner)throw new Error("Timeline requires an owner");this._buildStack=[],this._childConfigStack=[]}return u.prototype._getTargets=function(t){var n,r,i;return n=(r=(i=t.targets)!=null?i:t.target)!=null?r:this.owner,e.toArray(n)},u.prototype._mergeConfig=function(t){return e.any(this._childConfigStack)?e.extend(e.clone(e.last(this._childConfigStack)),t):t},u.prototype._addParentAnimation=function(t,n,r,i){var s,o,u;return e.isFunction(t)?s=t:(o=t,s=n),u=new r(i),o&&this._childConfigStack.push(o),this._buildStack.push(u),s(this),this._buildStack.pop(),o&&this._childConfigStack.pop(),this._pushAnimation(u)},u.prototype._addAnimation=function(e,t){var n;return n=new e(this._mergeConfig(t)),n.targets=this._getTargets(n),this._pushAnimation(n)},u.prototype._pushAnimation=function(e){return this._buildStack.length===0?this.owner.addAni(e):this._buildStack[this._buildStack.length-1].children.push(e),e},u.prototype._fade=function(t,r,i){return e.isNumber(t)&&(t={duration:t}),t.property="alpha",t.from=r,t.to=i,this._addAnimation(n,t)},u.prototype.reverse=function(e){return this._pushAnimation(e.reverse())},u.prototype.setProperty=function(e){return e==null&&(e={}),e.duration=0,e.from=e.to=e.value,this.tween(e)},u.prototype.bezier=function(e){return e==null&&(e={}),this._addAnimation(t,e)},u.prototype.tween=function(e){return e==null&&(e={}),this._addAnimation(n,e)},u.prototype.fadeIn=function(e){return e==null&&(e={}),this._fade(e,0,1)},u.prototype.fadeOut=function(e){return e==null&&(e={}),this._fade(e,1,0)},u.prototype.scale=function(e){return e==null&&(e={}),e.property="scale",this.tween(e)},u.prototype.color=function(e){return e==null&&(e={}),e.property="color",this.tween(e)},u.prototype.rotate=function(e){return e==null&&(e={}),e.property="angle",this.tween(e)},u.prototype.move=function(t){var n,r,i,s;return n=e.clone(t),n.easing=(i=t.easingX)!=null?i:t.easing,n.from=t.from.x,n.to=t.to.x,n.property="x",r=e.clone(t),r.easing=(s=t.easingY)!=null?s:t.easing,r.from=t.from.y,r.to=t.to.y,r.property="y",this.together(function(e){return e.tween(n),e.tween(r)})},u.prototype.together=function(e,t){return this._addParentAnimation(e,t,s)},u.prototype.sequence=function(e,t){return this.repeat(1,e,t)},u.prototype.forever=function(e,t){return this.repeat(Infinity,e,t)},u.prototype.repeat=function(e,t,n){return this._addParentAnimation(t,n,i,e)},u.prototype.wait=function(e){return this.waitBetween(e,e)},u.prototype.waitBetween=function(e,t){return this._addAnimation(r,{min:e,max:t})},u.prototype.invoke=function(e,t){return this._addAnimation(o,{func:e,context:t})},u.prototype.stop=function(){return this.owner.clearAnis()},u}()});
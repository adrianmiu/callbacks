/**
 * EventManager library - MIT licence
 * https://github.com/adrianmiu/callbacks
 */(function(d){var g;g=d.e=function(e){this.toString=function(){return e}};d.f=function(e){function d(a){var b="";-1!==a.lastIndexOf(".")&&(b=a.substr(0,a.lastIndexOf(".")),f[b]=f[b]||[],-1!==f[b].indexOf(a)||f[b].push(a),d(b))}var h={},f={};e=e||{c:"unique memory"};this.d=function(a){var b,c;b=a instanceof g?a:new g(a);c=a=a instanceof g?a.toString():a;h[c]||(h[c]=new Callbacks(e.c||"unique memory"),d(c));c=h[c];c.i(this,b,void 0);b.b=c.h;b.a=c.g;if((a=f[a])&&a.length){c=0;for(var l=a.length;c<l;c++){var k=
this.d(a[c]);[].push.apply(b.b,k.b);b.a=k.a}}return b}}})(window);
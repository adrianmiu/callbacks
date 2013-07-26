/**
 * Callbacks library - MIT licence
 * https://github.com/adrianmiu/callbacks
 */
(function(c){function e(a,b,d){return a.h.apply(a.i||d||this,b)}function k(a,b){return a.d<b.d?-1:a.d>b.d?1:0}var f=Object.prototype.hasOwnProperty;c.f=function(a){this.message=a;this.stack=Error().stack};c.f.prototype=Error();c.l=function(a){a=a+""===a?a.split(" "):a instanceof Array?a:["unique"];this.b=function(b){return-1!==a.indexOf(b)};var b=0;this.k=function(){return b++};this.a=[];this.contains=function(a){for(var b=this.a.length;b--;)if(this.a[b].callback===a)return!0;return!1};return this};
c=Callbacks.prototype;c.add=function(a,b,d){d=d||this.k();b={h:a,i:b,d:d};this.b("unique")&&this.contains(a)||(this.a.push(b),this.a.sort(k));this.b("once")&&f.call(this,"_lastResult")&&(this.c=e(b,null,this.g),this.b("memory")&&(this.e=this.e||[],this.e.push(this.c)));return this};c.remove=function(a){for(var b=this.a.length;b--;)this.a[b].callback===a&&this.a.splice(b,1);return this};c.m=function(){var a=[].slice.call(arguments);a.unshift(null);return this.j.apply(this,a)};c.j=function(a){var b=
[].slice.call(arguments,1,arguments.length);if(this.b("once")&&f.call(this,"_lastResult"))return this.c;var d=[];this.g=a;for(var c=this.a.length,g=c;g--;)try{d.push(e(this.a[c-g-1],b,a))}catch(h){if(h instanceof CallbacksBreakExecutionException)break;throw h;}this.b("memory")&&(this.e=d);return this.c=d[d.length-1]}})(window);
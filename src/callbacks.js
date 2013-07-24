(function(root, undefined){
	root.Callbacks = function(flags) {
		flags = (flags + '' === flags) 
			? flags.split(' ') 
		    : (flags instanceof Array) 
		    	? flags
		    	: ['unique'];
		this.hasFlag = function (flag) {
			return flags.indexOf(flag) !== -1;
		}
		return this;
	}
	// callbacks prototype
	var CP = Callbacks.prototype;
	// add a function to the callback list
	CP.on = function(name, func, priority, context) {}
	// add a function tot he callback list making sure it is executed only once
	CP.one = function(name, func, priority, context) {}
	// removes a function from the callback list
	CP.off = function(name, func) {}
	// trigger the execution of a callback list
	CP.trigger = function(name, data) {
		this.triggerWith(name, data, this);
	}
	// trigger the execution of a callback list within a certain context
	CP.triggerWith = function(name, data, context) {}
})(window, undefined);
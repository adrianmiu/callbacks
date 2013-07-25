(function(root, undefined){
	"use strict";

	// utility function to compare 2 callbacks
	var __compareCallbacks = function(c1, c2) {
		if (c1.priority < c2.priority) {
			return -1;
		} else if (c1.priority > c2.priority) {
			return 1;
		}
		return 0;
	};
	
	// method to reorder the callbacks based on their priorities
	// will be called after an callback is added to the registry
	var __updateCallbacksOrder = function() {
		this._registry.sort(__compareCallbacks);
	};
	
	// function to execute a callback (an object from the callbacks registry)
	var __executeCallback = function(clbk, data) {
		context = clbk.context || this;
		return clkb.call(context, data);
	};
	
	// if a callback throws this exception the rest of the callbacks will not be executed
	root.CallbacksBreakExecutionException = function(message) {
		this.message = message; 
		this.stack = Error().stack;
	}
	root.CallbacksBreakExecutionException.prototype =  new Error;
	
	root.Callbacks = function(flags) {
		// flags are options that alter the behaviour of the callback
		// unique: does not allow adding the same function to the registry
		// once: the callbacks are executed only once. Any subsequent calls will not be executed
		// memory: store all the results
		flags = (flags + '' === flags) 
			? flags.split(' ') 
		    : (flags instanceof Array) 
		    	? flags
		    	: ['unique'];
		this.hasFlag = function (flag) {
			return flags.indexOf(flag) !== -1;
		};
		
		// variable used to determine what is the next priority to be assigned
		// by default to a callback, in case one was not provided
		var priority = 0;
		this.getCurrentPriority = function() {
			return priority++;
		};
		
		// registry of all the callbacks
		this._registry = [];
		// method to check if the callback is already in the registry
		this.contains = function(func) {
			var len = this._registry.length, i=len;
			while (i--) {
				if (this._registry[i]['callback'] === func) {
					return true;
				}
			}
			return false;
		};
		return this;
	};
	// callbacks prototype
	var CP = Callbacks.prototype;
	// add a function to the callback list
	CP.add = function(func, context, priority) {
		priority = priority || this.getCurrentPriority();
		var entry = {
			callback: func,
			context: context,
			priority: priority
		};
		if (!this.hasFlag('unique') || !this.contains(func)) { 
			this._registry.push(entry);
			__updateCallbacksOrder.call(this);
		}
		return this;
	};
	// add a function tot he callback list making sure it is executed only once
	CP.remove = function(func) {
		var len = this._registry.length, i=len;
		while (i--) {
			if (this._registry[i]['callback'] === func) {
				this._registry.splice(i, 1);
			}
		}
		return this;
	};
	// removes a function from the callback list
	CP.fire = function(data) {
		return this.fireWith(data, null);
	};
	// trigger the execution of a callback list
	CP.fireWith = function(data, context) {
		if (this.hasFlag('once')) {
			return this._lastResult;
		}
		_results = [];
		// keep the last called context for 'once' type of callbacks
		this._lastContext = context;
		var len = this._registry.length, i=len;
		while (i--) {
			try {
				results.push(__executeCallback(this._registry[i], data));
			} catch (e) {
				if (e instanceof CallbacksBreakExecutionException) {
					break;
				}
				throw e;
			}
		}
		if (this.hasFlag('memory')) {
			this._results = _results;
		}
		this._lastResult = _results[_results.length - 1];
		return this._lastResult;
	};
})(window, undefined);
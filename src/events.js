(function(root, undefined){
	var EventManager, Event;
	root.Event = Event = function(name) {
		this.toString = function() {
			return name;
		}
	}
	root.EventManager = EventManager = function(options) {
		var _clbs = {}, _clbsList = [];
		options = options || {};
		var getCallbacks = function(name) {
			if (!_clbs[name]) {
				_clbs[name] = new Callbacks(options.flags || 'unique memory');
				_clbsList.push(name);
			}
			return _clbs[name];
		}
		this.on = function(name, func, context, priority) {
			getCallbacks(name).add(func, context, priority);
			return this;
		}
		this.off = function(name, func, context, priority) {
			getCallbacks(name).remove(func, context, priority);
			return this;
		}
		this.one = function(name, func, context, priority) {
			var self = this,
				onceFunc = function() {
					func.apply(self, [].slice.call(arguments));
					getCallbacks(name).remove(onceFunc);
				}
			getCallbacks(name).add(onceFunc, context, priority);
			return this;
		}
		this.trigger = function(name, data) {
			var evt,	// event object
				name,	// name of the event
				result,	// result of the callback execution
				clbs;	// callbacks object
			evt = name instanceof Event ? name : new Event(name);
			name = name instanceof Event ? name.toString() : name;
			clbs = getCallbacks(name);
			result = clbs.fireWith(this, evt, data);
			evt.results = evt.results || [];
			[].push.apply(evt.results, clbs._results);
			evt.lastResult = clbs._lastResult;
			return evt;
		}
	}
})(window);
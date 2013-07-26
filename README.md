Callbacks
=========

Library that implements the functionality of [jQuery Callbacks](http://api.jquery.com/jQuery.Callbacks/) and few other options:
* callback priority (you can specify an order in which the callbacks are executed
* stop the execution of the callbacks stack by throwing a CallbackBreakExecutionException error (similar to the "stopOnFalse" flag with the exception that your callbacks can actually return false)

Only 0.6Kb minified and gzipped.

Can be used for handling:

1. List of callbacks to be executed at once
2. Events
3. Pub/Sub

How to use
========
```javascript
// instanciate your callbacks stack
var clbs = new Callbacks('unique memory'); // the parameter is a string of flags

var someFunction = function (arg1, arg2, etc) {
	// your function implementation here
}

// add a function to the callbacks' stack, enforce a certain context and specify a priority
clbs.add(someFunction, someContext, priority);
// if you don't specify a priority the functions will be executed in the order they are added

// remove a function at any point
clbs.remove(someFunction);

// execute the callbacks stack
clbs.fire(arg1, arg2, etc);

// execute the callbacks stack in a specific context
clbs.fireWith(context, arg1, args2, etc);

// IMPORTANT NOTE!
// the context from the fireWith() call will NOT override the context added to the function, 
// if (!!!) there is one, but only if it wasn't provided

```

Callbacks flags
========
1. **unique**: the same callback can be added only once to the stack. This is the default flag (ie: if you don't specify anything).
2. **once**: a calbacks stack can only be fired once. Any callbacks added after the first fire() will be executed immediately
3. **memory**: stores the results of each callback

Callbacks flags can be combined; the most you can have is 'unique once memory'.
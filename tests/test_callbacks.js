test( "Callbacks exists in the global namespace", function() {
	ok(window.Callbacks, "Callbacks must exist in the global namespace" );
});

test ('Callbacks can be created', function() {
	var callbacks = new Callbacks();
	ok(callbacks instanceof Object, 'Callback was created');
	['add', 'remove', 'fire', 'fireWith'].forEach(function(element, index) {
		ok(callbacks[element] instanceof Function, 'method ' + element + '() exits');
	});
});

test ('Flags are correctly preserved', function() {
	var clbs = new Callbacks('flagA flagB');
	ok(clbs.hasFlag('flagA'), 'callback has flagA');
	ok(clbs.hasFlag('flagB'), 'callback has flagB');
	ok(!clbs.hasFlag('flagC'), 'callback has flagC');
});

test ('Flags can be passed as array', function() {
	var clbs = new Callbacks(['flagA', 'flagB']);
	ok(clbs.hasFlag('flagA'), 'callback has flagA');
	ok(clbs.hasFlag('flagB'), 'callback has flagB');
	ok(!clbs.hasFlag('flagC'), 'callback has flagC');
});

test('Default flag is "unique"', function() {
	var clbs = new Callbacks();
	ok(clbs.hasFlag('unique'), 'callback has the "unique" flag');
});

test('Priority is generated correctly', function() {
	var clbs = new Callbacks('unique');
	equal(0, clbs.getCurrentPriority(), 'First priority is 0');
	equal(1, clbs.getCurrentPriority(), 'Second priority is 1');
	equal(2, clbs.getCurrentPriority(), 'Third priority is 2');
});

test('Callbacks are added to the stack', function() {
	var clbs = new Callbacks('unique');
	var func = function() {},
		context = {},
		found = 0;
	clbs.add(func, context);
	ok (clbs.contains(func), 'callback is detected as being in the stack');
	
	// add again to test if
	clbs.add(func, context);
	clbs._registry.forEach(function(clbk, index) {
		if (clbk.callback == func) {
			found++;
		}
	});
	equal (found, 1, 'callback was added to the stack');
});

test('Callbacks are added to the stack multiple times', function() {
	var clbs = new Callbacks('multiple');
	var func = function() {},
		context = {},
		found = 0;
	clbs.add(func, context);
	clbs.add(func, context);
	clbs._registry.forEach(function(clbk, index) {
		if (clbk.callback == func) {
			found++;
		}
	});
	equal (found, 2, 'callback was added to the stack 2 times');
});

test('Callbacks are added in the proper order', function() {
	expect(3);
	var clbs = new Callbacks('unique');
	var	funcA = function() { return 'A'; },
		funcB = function() { return 'B'; },
		funcC = function() { return 'C'; },
		context = {};
	clbs.add(funcA, context); // with default priority (ie: the available one)
	clbs.add(funcB, context, -999); // to be executed first
	clbs.add(funcC, context, -10); // to be executed second

	equal(clbs._registry[0]['callback'], funcB, 'first callback is funcB');
	equal(clbs._registry[1]['callback'], funcC, 'second callback is funcC');
	equal(clbs._registry[2]['callback'], funcA, 'third callback is funcA');
});

test('Callbacks are removed from the stack', function() {
	expect(1);
	var clbs = new Callbacks('multiple');
	var func = function() {},
		context = {};
	clbs.add(func, context);
	clbs.add(func, context);
	clbs.remove(func);
	ok (!clbs.contains(func), 'callback was removed');	
});


test('Callbacks are executed in the proper order', function() {
	expect(1);
	var clbs = new Callbacks();
	var result = '';

	var	funcA = function() { result += 'A'; },
		funcB = function() { result += 'B'; },
		funcC = function() { result += 'C'; };
	clbs.add(funcA, null); // with default priority (ie: the available one)
	clbs.add(funcB, null, -999); // to be executed first
	clbs.add(funcC, null, -10); // to be executed second

	clbs.fire();
	equal(result, 'BCA', 'callbacks were executed based on their priorities');

});


test('Callbacks are executed with their associtated context', function() {
	var clbs = new Callbacks();
	var result = '';

	var	context = {number: 3},
		funcA = function() { result += ' A' + this.number; },
		funcB = function() { result += ' B' + this.number; },
		funcC = function() { result += ' C' + this.number; };
	clbs.add(funcA, context); // with default priority (ie: the available one)
	clbs.add(funcB, context, -999); // to be executed first
	clbs.add(funcC, context, -10); // to be executed second

	clbs.fire();
	equal(result, ' B3 C3 A3', 'callbacks were executed with the proper context');

});

test('Callbacks are executed  with the passed-in context', function() {
	expect(2);
	var clbs = new Callbacks();
	var result = '';

	var	context = {number: 0},
		globalContext = {number: 0},
		funcA = function() { result += 'A'; this.number++; },
		funcB = function() { result += 'B'; this.number++; },
		funcC = function() { result += 'C'; this.number++; };
	clbs.add(funcA, context); // with default priority (ie: the available one)
	clbs.add(funcB, null, -999); // to be executed first
	clbs.add(funcC, context, -10); // to be executed second

	clbs.fireWith(globalContext);
	equal(context.number, 2, 'local context was used 2 times');
	equal(globalContext.number, 1, 'global context was used 1 time');
});


test('Callbacks are executed with parameters', function() {
	expect(1);
	
	var clbs = new Callbacks();
	var result = '';

	var	funcA = function(a1, a2, a3) { result += 'A' + a1 + a2 + a3; },
		funcB = function(a1, a2, a3) { result += 'B' + a1 + a2 + a3; },
		funcC = function(a1, a2, a3) { result += 'C' + a1 + a2 + a3; };
	clbs.add(funcA, null); // with default priority (ie: the available one)
	clbs.add(funcB, null, -999); // to be executed first
	clbs.add(funcC, null, -10); // to be executed second

	clbs.fire('1', '2', '3');
	equal(result, 'B123C123A123', 'callbacks were executed with parameters');
	
});

test('Throwing CallbacksBreakExecutionException stops the execution of subsequent callbacks', function() {
	expect(1);
	
	var clbs = new Callbacks();
	var result = '';

	var	funcA = function(a1, a2, a3) { result += 'A' + a1 + a2 + a3; },
		funcB = function(a1, a2, a3) { result += 'B' + a1 + a2 + a3; },
		funcC = function(a1, a2, a3) { throw new CallbacksBreakExecutionException(); };
	clbs.add(funcA, null); // with default priority (ie: the available one)
	clbs.add(funcB, null, -999); // to be executed first
	clbs.add(funcC, null, -10); // to be executed second

	clbs.fire('1', '2', '3');
	equal(result, 'B123', 'CallbacksBreakExecutionException broke the execution');
	
});

test('Results are memorized with the "memory" flag', function() {
	expect(3);
	var clbs = new Callbacks('memory');
	var	funcA = function() { return 'A'; },
		funcB = function() { return 'B'; },
		funcC = function() { return 'C'; },
		context = {};
	clbs.add(funcA, context); // with default priority (ie: the available one)
	clbs.add(funcB, context, -999); // to be executed first
	clbs.add(funcC, context, -10); // to be executed second

	var result = clbs.fire();
	ok(clbs.hasFlag('memory'), 'Callbacks stack has the "memory" flag');
	deepEqual(clbs._results, ['B', 'C', 'A'], 'Results are stored for later use');
	equal(result, 'A', 'Result of the fire() is the last result');
});


test('Callbacks object is fired only once with the "once" flag', function() {
	expect(1);
	var clbs = new Callbacks('once');
	var result = '';

	var	funcA = function() { result += 'A'; },
		funcB = function() { result += 'B'; },
		funcC = function() { result += 'C'; };
	clbs.add(funcA, null); // with default priority (ie: the available one)
	clbs.add(funcB, null, -999); // to be executed first
	clbs.add(funcC, null, -10); // to be executed second

	clbs.fire();
	clbs.fire();
	equal(result, 'BCA', 'callbacks were executed only once');
});

test('With the "once" flag, callbacks added after firing are executed immediately', function() {
	expect(3);
	var clbs = new Callbacks('once memory');
	var result = '';

	var	funcA = function() { result += 'A'; },
		funcB = function() { result += 'B'; },
		funcC = function() { result += 'C'; },
		funcD = function() { result += 'D'; };
	clbs.add(funcA, null); // with default priority (ie: the available one)
	clbs.add(funcB, null, -999); // to be executed first
	clbs.add(funcC, null, -10); // to be executed second

	clbs.fire();
	equal(result, 'BCA', 'callbacks were executed correctly');
	
	clbs.add(funcD);
	equal(result, 'BCAD', 'new callback was executed immediately');
	equal(clbs._results.length, 4, 'result of the new callback was added to the list');
});

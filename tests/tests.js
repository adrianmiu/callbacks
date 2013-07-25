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
	var clbs = new Callbacks('unique');
	var	funcA = function() { return 'A'; },
		funcB = function() { return 'B'; },
		funcC = function() { return 'C'; },
		context = {};
	clbs.add(funcA, context); // with default priority (ie: the available one)
	clbs.add(funcB, context, -999); // to be executed first
	clbs.add(funcC, context, -10); // to be executed second
	console.log(clbs);
	equal(clbs._registry[0]['callback'], funcB, 'first callback is funcB');
	equal(clbs._registry[1]['callback'], funcC, 'second callback is funcC');
	equal(clbs._registry[2]['callback'], funcA, 'third callback is funcA');
});

test('Callbacks are removed from the stack', function() {
	var clbs = new Callbacks('multiple');
	var func = function() {},
		context = {};
	clbs.add(func, context);
	clbs.add(func, context);
	clbs.remove(func);
	ok (!clbs.contains(func), 'callback was removed');	
});


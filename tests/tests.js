test( "Callbacks exists in the global namespace", function() {
	ok(window.Callbacks, "Callbacks must exist in the global namespace" );
});

test ('Callbacks can be created', function() {
	var callbacks = new Callbacks();
	ok(callbacks instanceof Object, 'Callback was created');
	['on', 'off', 'trigger', 'on'].forEach(function(element, index) {
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

test ('Default flag is "unique"', function() {
	var clbs = new Callbacks();
	ok(clbs.hasFlag('unique'), 'callback has the "unique" flag');
});
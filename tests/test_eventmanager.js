test("Classes exists in the global namespace", function() {
	expect(2);
	ok(window.EventManager, "EventManager must exist in the global namespace" );
	ok(window.Event, "Event must exist in the global namespace" );
});

test("Callbacks can be added to the event manager", function() {
	var evtMan = new EventManager();
	evtMan.on('click', function() {
		ok(true, 'Event fired');
	});
	evtMan.trigger('click');
});

test("Callbacks can be added ONCE to event manager", function() {
	expect(1);
	var evtMan = new EventManager();
	evtMan.one('click', function() {
		ok(true, 'Event fired');
	});
	evtMan.trigger('click');
	evtMan.trigger('click');
});

test("The event stores the results", function() {
	var evtMan = new EventManager(),
		evt;
	evtMan.on('click', function() {
		return 'A';
	});
	evtMan.on('click', function() {
		return 'B';
	});
	evt = evtMan.trigger('click');
	deepEqual(evt.results, ['A', 'B'], 'Event stores the results')
});

test("EventManager can be used as functional mixin", function() {
	expect(1);
	var obj = {};
	EventManager.apply(obj);
	obj.on('name', function() {
		equal(this, obj, 'Event was executed in the context of the object');
	});
	obj.trigger('name');
});

test("Events can be trigger as instances of Event", function() {
	expect(2);
	var evtMan = new EventManager(),
		evt = new Event('name');
	evtMan.on('name', function() {
		ok(true, 'Event was executed');
		return 'A';
	});
	evtMan.trigger(evt);
	deepEqual(evt.results, ['A'], 'The event object stores the result');
});

test("Namespaced events are executed", function() {
	expect(2);
	var evtMan = new EventManager();
	evtMan.on('name.subname', function() {
		return 'A';
	});
	evtMan.on('name.subname_a', function() {
		return 'G';
	});
	evtMan.on('name.subname.deepsubname', function() {
		return 'C';
	});
	evtMan.on('name', function() {
		return 'B';
	});
	deepEqual(evtMan.trigger('name.subname.deepsubname').results, ['C'], 'Namespaced event was executed');
	deepEqual(evtMan.trigger('name').results, ['B', 'A', 'C', 'G'], 'Non-namespaced event included the sub-events');
});


/*
test("", function() {

});
 */
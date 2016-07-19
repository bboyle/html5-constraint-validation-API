(function( $ ) {
	'use strict';

	var module = QUnit.module;
	var test = QUnit.test;

	module( 'environment', lifecycleCVAPI );

	test( 'required fields are in test form', function( assert ) {
		assert.expect( 4 );

		assert.strictEqual($( 'form#test' ).length, 1, 'form#test is present' );
		assert.strictEqual($( 'input#foo', 'form#test' ).length, 1, 'form#test contains input#foo' );
		assert.ok($( 'input#foo' ).attr( 'required' ), 'input#foo has @required' );
		assert.strictEqual($( 'input#foo' ).val(), '', 'input#foo has no value' );

	});


	module( 'invalid events', {
		beforeEach: lifecycleCVAPI.beforeEach,
		afterEach: function() {
			// unbind event handlers
			$( 'form, #foo' ).unbind( 'invalid' );
			lifecycleCVAPI.afterEach();
		}
	});

	test( 'invalid thrown for @required', function( assert ) {
		assert.expect( 3 );

		var invalidEvents = 0,
			handler = function( event ) {
				invalidEvents++;
				assert.strictEqual(invalidEvents, 1, '1 invalid event was triggered' );
				assert.strictEqual(event.target, $( '#foo' )[ 0 ], 'invalid event thrown by #foo' );
			}
		;

		$( '#foo' ).bind( 'invalid', handler );
		// checkValidity should trigger invalid event
		$( '#foo' )[ 0 ].checkValidity();

		assert.strictEqual($( '#foo' )[ 0 ].validity.valid, false, '#foo is invalid' );
	});

	test( 'invalid cannot be captured on form', function( assert ) {
		assert.expect( 1 );

		var handler = function() {
			assert.ok(true, 'invalid handler was triggered' );
			assert.strictEqual(true, false, 'invalid event thrown by #foo, captured on form' );
		};

		$( 'form' ).bind( 'invalid', handler );
		// checkValidity should trigger invalid event
		$( '#foo' )[ 0 ].checkValidity();

		assert.strictEqual($( '#foo' )[ 0 ].validity.valid, false, '#foo is invalid' );
	});

	// how many invalid events expected for a set of radio buttons?


}( jQuery ));

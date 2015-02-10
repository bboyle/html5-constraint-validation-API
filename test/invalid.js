(function( $ ) {
	'use strict';

	module( 'environment', lifecycleCVAPI );

	test( 'required fields are in test form', 4, function() {

		strictEqual( $( 'form#test' ).length, 1, 'form#test is present' );
		strictEqual( $( 'input#foo', 'form#test' ).length, 1, 'form#test contains input#foo' );
		ok( $( 'input#foo' ).attr( 'required' ), 'input#foo has @required' );
		strictEqual( $( 'input#foo' ).val(), '', 'input#foo has no value' );

	});


	module( 'invalid events', {
		beforeEach: lifecycleCVAPI.beforeEach,
		afterEach: function() {
			// unbind event handlers
			$( 'form, #foo' ).unbind( 'invalid' );
			lifecycleCVAPI.afterEach();
		}
	});

	test( 'invalid thrown for @required', 3, function() {

		var invalidEvents = 0,
			handler = function( event ) {
				invalidEvents++;
				strictEqual( invalidEvents, 1, '1 invalid event was triggered' );
				strictEqual( event.target, $( '#foo' )[ 0 ], 'invalid event thrown by #foo' );
			}
		;

		$( '#foo' ).bind( 'invalid', handler );
		// checkValidity should trigger invalid event
		$( '#foo' )[ 0 ].checkValidity();

		strictEqual( $( '#foo' )[ 0 ].validity.valid, false, '#foo is invalid' );
	});

	test( 'invalid cannot be captured on form', 1, function() {

		var handler = function() {
			ok( true, 'invalid handler was triggered' );
			strictEqual( true, false, 'invalid event thrown by #foo, captured on form' );
		};

		$( 'form' ).bind( 'invalid', handler );
		// checkValidity should trigger invalid event
		$( '#foo' )[ 0 ].checkValidity();

		strictEqual( $( '#foo' )[ 0 ].validity.valid, false, '#foo is invalid' );
	});

	// how many invalid events expected for a set of radio buttons?


}( jQuery ));

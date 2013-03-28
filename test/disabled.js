(function( $ ) {
	'use strict';
	
	module( 'environment', lifecycleCVAPI );

	test( 'required fields are in test form', function() {

		strictEqual( $( 'form#test' ).length, 1, 'form#test is present' );
		strictEqual( $( 'form#test input#foo' ).length, 1, 'form#test contains input#foo' );
		strictEqual( $( 'form#test input#disabled' ).length, 1, 'form#test contains input#disabled' );
		ok( $( 'input#foo' ).attr( 'required' ), 'input#foo has @required' );
		ok( $( 'input#disabled' ).attr( 'required' ), 'input#disabled has @required' );
		ok( $( 'input#disabled' ).attr( 'disabled' ), 'input#foo has @disabled' );

	});


	module( 'validityState and disabled controls', lifecycleCVAPI );

	test( 'disabled controls are always valid', 3, function() {

		// make disabled invalid
		$( '#disabled' ).val( '' );
		strictEqual( $( '#disabled' )[ 0 ].checkValidity(), true, '#disabled .checkValidity() valid' );
		// strictEqual( $( '#disabled' )[ 0 ].validity.valid, true, '#disabled .validity.valid valid' ); // IE 10.0.1008.16421 disagrees

		// make foo valid
		$( '#disabled' ).val( 'foo' );
		strictEqual( $( '#disabled' )[ 0 ].checkValidity(), true, '#disabled .checkValidity() valid' );
		strictEqual( $( '#disabled' )[ 0 ].validity.valid, true, '#disabled .validity.valid valid' );
		
	});


	module( 'invalid events and disabled controls', lifecycleCVAPI );

	test( 'disabled controls never trigger invalid', 0, function() {

		$( '#disabled' ).bind( 'invalid.TEST', function() {
			ok( false, 'invalid event detected' );
		});

		// make disabled invalid
		$( '#disabled' ).val( '' );
		$( '#disabled' )[ 0 ].checkValidity(); // should not throw any invalid events

		// teardown
		$( '#disabled' ).unbind( 'invalid.TEST' );
		
	});


	module( 'submit and disabled controls', lifecycleCVAPI );

	test( 'disabled controls never abort submit', 1, function() {

		var submitted = 0;
		$( '#test' ).bind( 'submit.TEST', function() {
			submitted++;
			ok( submitted <= 1, 'invalid event detected' );
		});

		// make foo valid
		$( '#foo' ).val( 'foo' );

		// make disabled invalid
		$( '#disabled' ).val( '' );

		$( '#test' ).trigger( 'submit' ); // should succeed, even tho #disabled would be invalid (if enabled)

		// teardown
		$( '#test' ).unbind( 'submit.TEST' );
		
	});


}( jQuery ));

(function( $ ) {
	'use strict';
	
	module( 'environment', lifecycleCVAPI );

	test( 'required fields are in test form', 4, function() {

		strictEqual( $( 'form#test' ).length, 1, 'form#test is present' );
		strictEqual( $( 'form#test input#foo' ).length, 1, 'form#test contains input#foo' );
		ok( $( 'input#foo' ).attr( 'required' ), 'input#foo has @required' );
		strictEqual( $( 'input#foo' ).val(), '', 'input#foo has no initial value' );

	});


	module( '.checkValidity() reflects validity', lifecycleCVAPI );

	test( 'invalid fields return false', 2, function() {

		strictEqual( $( '#foo' )[ 0 ].checkValidity(), false, '.checkValidity() false for blank required field' );
		strictEqual( $( '#foo' )[ 0 ].validity.valid, false, '.validity.valid false for blank required field' );
		
	});


	module( '.checkValidity() triggers invalid events', lifecycleCVAPI );

	test( 'invalid fields trigger events', 3, function() {
		
		// setup - detect invalid events
		var invalidDetectedOnFoo = 0;

		$( '#foo' ).bind( 'invalid.TEST', function() {
			invalidDetectedOnFoo++;
			ok( invalidDetectedOnFoo <= 1, 'invalid event detected on foo' );
		});

		strictEqual( $( '#foo' )[ 0 ].checkValidity(), false, 'foo is invalid' );

		// make it valid
		$( '#foo' ).val( 'foo' );
		strictEqual( $( '#foo' )[ 0 ].checkValidity(), true, 'foo is valid' );

		// teardown
		$( '#foo' ).unbind( 'invalid.TEST' );
	});


}( jQuery ));

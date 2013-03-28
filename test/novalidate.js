(function( $ ) {
	'use strict';
	
	var	userInitiatedSubmit = function() {
		$( '#test :submit' )[ 0 ].click();
	};

	module( 'environment', lifecycleCVAPI );

	test( 'required fields are in test form', 5, function() {

		strictEqual( $( 'form#test' ).length, 1, 'form#test is present' );
		ok( $( 'form#test' ).attr( 'novalidate' ), 'form#test has @novalidate' );
		strictEqual( $( 'form#test input#foo' ).length, 1, 'form#test contains input#foo' );
		ok( $( 'input#foo' ).attr( 'required' ), 'input#foo has @required' );
		strictEqual( $( 'input#foo' ).val(), '', 'input#foo has no value' );

	});


	module( 'invalid events', lifecycleCVAPI );

	test( 'invalid not thrown on submit', 1, function() {

		var handler = function( event ) {
			ok( false, 'invalid handler should not be triggered' );
			strictEqual( event.target, $( '#foo' )[ 0 ], 'invalid event detected on #foo' );
		};

		$( '#foo' ).bind( 'invalid', handler );

		userInitiatedSubmit();

		ok( true, 'invalid event not seen' );
	});


	module( 'submit events', lifecycleCVAPI );

	test( 'submit events triggered with invalid fields', 2, function() {

		var handler = function() {
			ok( true, 'submit event detected' );
		};

		$( '#foo' ).val( '' );
		$( '#test' ).bind( 'submit', handler );

		userInitiatedSubmit();

		strictEqual( $( '#foo' )[ 0 ].validity.valid, false, '#foo is invalid' );

		// teardown
		$( '#test' ).unbind( 'submit', handler );

	});


}( jQuery ));

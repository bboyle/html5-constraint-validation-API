(function( $ ) {
	'use strict';
	
	var	userInitiatedSubmit = function() {
		$( ':submit', '#test' )[0].click();
	};

	module( 'environment', lifecycleCVAPI );

	test( 'required fields are in test form', 4, function() {

		strictEqual( $( 'form#test' ).length, 1, 'form#test is present' );
		strictEqual( $( 'input#foo', 'form#test' ).length, 1, 'form#test contains input#foo' );
		ok( $( 'input#foo' ).attr( 'required' ), 'input#foo has @required' );
		strictEqual( $( 'input#foo' ).val(), '', 'input#foo has no value' );

	});


	module( 'invalid events', lifecycleCVAPI );

	test( 'invalid thrown for @required', 2, function() {

		var handler = function( event ) {
			ok( true, 'invalid handler was triggered' );
			strictEqual( event.target, $( '#foo' )[0], 'invalid event thrown by #foo' );
		};

		$( '#foo' ).bind( 'invalid', handler );

		userInitiatedSubmit();
	});

	test( 'invalid cannot be captured on form', 1, function() {

		var handler = function() {
			ok( true, 'invalid handler was triggered' );
			strictEqual( true, false, 'invalid event thrown by #foo, captured on form' );
		};

		$( 'form' ).bind( 'invalid', handler );

		userInitiatedSubmit();

		ok( true, 'text complete' );
	});

	// how many invalid events expected for a set of radio buttons?


}( jQuery ));

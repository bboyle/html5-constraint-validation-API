(function( $ ) {
	'use strict';
	
	module( 'environment', lifecycleCVAPI );

	test( 'test fields are in test form', function() {

		strictEqual( $( 'form#test' ).length, 1, 'form#test is present' );
		strictEqual( $( 'form#test input#foo' ).length, 1, 'form#test contains input#foo' );
		strictEqual( $( 'form#test input#email' ).length, 1, 'form#test contains input#email' );

	});

	test( 'form submission is suppressed', function() {

		var form = $( '#test' );

		form.submit();
		ok( true, 'form was submitted and we are still running tests' );

		form.find( '[type=submit]' ).click();
		ok( true, 'submit button clicked and we are still running tests' );

	});


	module( 'input validityState customError', lifecycleCVAPI );

	test( 'validity.customError', 8, function() {
		
		$( '#foo' )[ 0 ].setCustomValidity( 'foo is invalid' );

		strictEqual( $( '#foo' )[ 0 ].validity.customError, true, '#foo validity.customError should be true' );
		strictEqual( $( '#foo' )[ 0 ].validity.valid, false, '#foo validity.valid should be false' );
		strictEqual( $( '#foo' )[ 0 ].validationMessage, 'foo is invalid', '#foo .validityMessage found' );
		strictEqual( $( '#email' )[ 0 ].validity.customError, false, '#email validity.customError should be false' );

		$( '#foo' )[ 0 ].checkValidity();

		strictEqual( $( '#foo' )[ 0 ].validity.customError, true, '#foo validity.customError should be true' );
		strictEqual( $( '#foo' )[ 0 ].validity.valid, false, '#foo validity.valid should be false' );
		strictEqual( $( '#foo' )[ 0 ].validationMessage, 'foo is invalid', '#foo .validityMessage found' );
		strictEqual( $( '#email' )[ 0 ].validity.customError, false, '#email validity.customError should be false' );

	});

	test( 'can get message set with setCustomValidity()', function() {
		
		// must be @example.com
		$( '#email' )[ 0 ].setCustomValidity( 'Must be an @example.com email address' );

		strictEqual( $( '#email' )[ 0 ].validity.customError, true, '#email validity.customError should be true' );
		strictEqual( $( '#email' )[ 0 ].validationMessage, 'Must be an @example.com email address', '#email validationMessage is correct' );

		// remove custom error
		$( '#email' )[ 0 ].setCustomValidity( '' );
		strictEqual( $( '#email' )[ 0 ].validity.customError, false, '#email validity.customError should be false' );
		strictEqual( $( '#email' )[ 0 ].validationMessage, '', '#email validationMessage is empty' );

	});

	test( 'setCustomValidity() can mask other errors', 6, function() {
		
		// make email invalid (type error)
		$( '#email' ).val( 'foo' );
		// TODO validity checking only happening on submit! should work on 'change', or call .checkValidity()
		$( 'form' ).trigger( 'submit' );
		// then set a custom error
		$( '#email' )[ 0 ].setCustomValidity( 'custom error' );
		// custom error is shown
		strictEqual( $( '#email' )[ 0 ].validity.valid, false, '#email is not valid' );
		strictEqual( $( '#email' )[ 0 ].validity.typeMismatch, true, '#email has typeMismatch' );
		strictEqual( $( '#email' )[ 0 ].validationMessage, 'custom error', 'custom error shown' );

		// remove custom error
		$( '#email' )[ 0 ].setCustomValidity( '' );
		// type error now current
		strictEqual( $( '#email' )[ 0 ].validity.customError, false, '#email has no custom error' );
		strictEqual( $( '#email' )[ 0 ].validity.valid, false, '#email is still not valid' );
		strictEqual( $( '#email' )[ 0 ].validity.typeMismatch, true, '#email has typeMismatch' );

	});

	test( 'setCustomValidity() from change event', function() {
		
		// must be @example.com
		$( '#email' ).bind( 'change.TEST', function() {
			var inDomain = /@example\.com/.test( this.value ),
				customError = inDomain ? '' : 'Must be an @example.com email address'
			;

			this.setCustomValidity( customError );
		});

		$( '#email' ).val( 'foo@bar.com' ).trigger( 'change' );
		strictEqual( $( '#email' )[ 0 ].validity.customError, true, '#email validity.customError should be true' );

		$( '#email' ).val( 'foo@example.com' ).trigger( 'change' );
		strictEqual( $( '#email' )[ 0 ].validity.customError, false, '#email validity.customError should be false' );

		// teardown
		$( '#email' ).unbind( 'change.TEST' );

	});


}( jQuery ));

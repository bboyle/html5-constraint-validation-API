(function( $ ) {
	'use strict';

	var module = QUnit.module;
	var test = QUnit.test;

	module( 'environment', lifecycleCVAPI );

	test( 'test fields are in test form', function( assert ) {

		assert.strictEqual($( 'form#test' ).length, 1, 'form#test is present' );
		assert.strictEqual($( 'form#test input#foo' ).length, 1, 'form#test contains input#foo' );
		assert.strictEqual($( 'form#test input#email' ).length, 1, 'form#test contains input#email' );

	});

	test( 'form submission is suppressed', function( assert ) {

		var form = $( '#test' );

		form.submit();
		assert.ok(true, 'form was submitted and we are still running tests' );

		form.find( '[type=submit]' ).click();
		assert.ok(true, 'submit button clicked and we are still running tests' );

	});



	module( 'input validityState customError', lifecycleCVAPI );

	test( 'validity.customError', function( assert ) {
		assert.expect( 8 );

		$( '#foo' )[ 0 ].setCustomValidity( 'foo is invalid' );

		assert.strictEqual($( '#foo' )[ 0 ].validity.customError, true, '#foo validity.customError should be true' );
		assert.strictEqual($( '#foo' )[ 0 ].validity.valid, false, '#foo validity.valid should be false' );
		assert.strictEqual($( '#foo' )[ 0 ].validationMessage, 'foo is invalid', '#foo .validityMessage found' );
		assert.strictEqual($( '#email' )[ 0 ].validity.customError, false, '#email validity.customError should be false' );

		$( '#foo' )[ 0 ].checkValidity();

		assert.strictEqual($( '#foo' )[ 0 ].validity.customError, true, '#foo validity.customError should be true' );
		assert.strictEqual($( '#foo' )[ 0 ].validity.valid, false, '#foo validity.valid should be false' );
		assert.strictEqual($( '#foo' )[ 0 ].validationMessage, 'foo is invalid', '#foo .validityMessage found' );
		assert.strictEqual($( '#email' )[ 0 ].validity.customError, false, '#email validity.customError should be false' );

	});

	test( 'can get message set with setCustomValidity()', function( assert ) {

		// must be @example.com
		$( '#email' )[ 0 ].setCustomValidity( 'Must be an @example.com email address' );

		assert.strictEqual($( '#email' )[ 0 ].validity.customError, true, '#email validity.customError should be true' );
		assert.strictEqual($( '#email' )[ 0 ].validationMessage, 'Must be an @example.com email address', '#email validationMessage is correct' );

		// remove custom error
		$( '#email' )[ 0 ].setCustomValidity( '' );
		assert.strictEqual($( '#email' )[ 0 ].validity.customError, false, '#email validity.customError should be false' );
		assert.strictEqual($( '#email' )[ 0 ].validationMessage, '', '#email validationMessage is empty' );

	});

	test( 'setCustomValidity() can mask other errors', function( assert ) {
		assert.expect( 7 );

		// make email invalid (type error)
		$( '#email' ).val( 'foo' );
		// TODO validity checking only happening on submit! should work on 'change', or call .checkValidity()
		$( '#email' )[ 0 ].checkValidity();

		// then set a custom error
		$( '#email' )[ 0 ].setCustomValidity( 'custom error' );
		// custom error is shown
		assert.strictEqual($( '#email' )[ 0 ].validity.valid, false, '#email is still invalid' );
		assert.strictEqual($( '#email' )[ 0 ].validity.customError, true, '#email has a custom error' );
		assert.strictEqual($( '#email' )[ 0 ].validity.typeMismatch, true, '#email has typeMismatch' );
		assert.strictEqual($( '#email' )[ 0 ].validationMessage, 'custom error', 'custom error shown' );

		// remove custom error
		$( '#email' )[ 0 ].setCustomValidity( '' );
		// type error now current
		assert.strictEqual($( '#email' )[ 0 ].validity.customError, false, '#email has no custom error' );
		assert.strictEqual($( '#email' )[ 0 ].validity.valid, false, '#email is still not valid' );
		assert.strictEqual($( '#email' )[ 0 ].validity.typeMismatch, true, '#email has typeMismatch' );

	});

	test( 'setCustomValidity() from change event', function( assert ) {

		// must be @example.com
		$( '#email' ).bind( 'change.TEST', function() {
			var inDomain = /@example\.com/.test( this.value ),
				customError = inDomain ? '' : 'Must be an @example.com email address'
			;

			this.setCustomValidity( customError );
		});

		$( '#email' ).val( 'foo@bar.com' ).trigger( 'change' );
		assert.strictEqual($( '#email' )[ 0 ].validity.customError, true, '#email validity.customError should be true' );

		$( '#email' ).val( 'foo@example.com' ).trigger( 'change' );
		assert.strictEqual($( '#email' )[ 0 ].validity.customError, false, '#email validity.customError should be false' );

		// teardown
		$( '#email' ).unbind( 'change.TEST' );

	});

}( jQuery ));

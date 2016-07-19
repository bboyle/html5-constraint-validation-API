(function( $ ) {
	'use strict';

	var module = QUnit.module;
	var test = QUnit.test;

	module( 'environment', lifecycleCVAPI );

	test( 'required fields are in test form', function( assert ) {
		assert.expect( 4 );

		assert.strictEqual($( 'form#test' ).length, 1, 'form#test is present' );
		assert.strictEqual($( 'form#test input#foo' ).length, 1, 'form#test contains input#foo' );
		assert.ok($( 'input#foo' ).attr( 'required' ), 'input#foo has @required' );
		assert.strictEqual($( 'input#foo' ).val(), '', 'input#foo has no initial value' );

	});


	module( '.checkValidity() reflects validity', lifecycleCVAPI );

	test( 'invalid fields return false', function( assert ) {
		assert.expect( 2 );

		assert.strictEqual($( '#foo' )[ 0 ].checkValidity(), false, '.checkValidity() false for blank required field' );
		assert.strictEqual($( '#foo' )[ 0 ].validity.valid, false, '.validity.valid false for blank required field' );

	});


	module( '.checkValidity() triggers invalid events', lifecycleCVAPI );

	test( 'invalid fields trigger events', function( assert ) {
		assert.expect( 3 );

		// setup - detect invalid events
		var invalidDetectedOnFoo = 0;

		$( '#foo' ).bind( 'invalid.TEST', function() {
			invalidDetectedOnFoo++;
			assert.strictEqual(invalidDetectedOnFoo, 1, 'invalid event detected on foo' );
		});

		assert.strictEqual($( '#foo' )[ 0 ].checkValidity(), false, 'foo is invalid' );

		// make it valid
		$( '#foo' ).val( 'foo' );
		assert.strictEqual($( '#foo' )[ 0 ].checkValidity(), true, 'foo is valid' );

		// teardown
		$( '#foo' ).unbind( 'invalid.TEST' );
	});


}( jQuery ));

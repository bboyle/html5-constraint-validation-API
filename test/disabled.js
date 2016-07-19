(function( $ ) {
	'use strict';

	var module = QUnit.module;
	var test = QUnit.test;

	module( 'environment', lifecycleCVAPI );

	test( 'required fields are in test form', function( assert ) {

		assert.strictEqual($( 'form#test' ).length, 1, 'form#test is present' );
		assert.strictEqual($( 'form#test input#foo' ).length, 1, 'form#test contains input#foo' );
		assert.strictEqual($( 'form#test input#disabled' ).length, 1, 'form#test contains input#disabled' );
		assert.ok($( 'input#foo' ).attr( 'required' ), 'input#foo has @required' );
		assert.ok($( 'input#disabled' ).attr( 'required' ), 'input#disabled has @required' );
		assert.ok($( 'input#disabled' ).attr( 'disabled' ), 'input#foo has @disabled' );

	});


	module( 'validityState and disabled controls', lifecycleCVAPI );

	test( 'disabled controls are always valid', function( assert ) {
		assert.expect( 3 );

		// make disabled invalid
		$( '#disabled' ).val( '' );
		assert.strictEqual($( '#disabled' )[ 0 ].checkValidity(), true, '#disabled .checkValidity() valid' );
		// assert.strictEqual($( '#disabled' )[ 0 ].validity.valid, true, '#disabled .validity.valid valid' ); // IE 10.0.1008.16421 disagrees

		// make foo valid
		$( '#disabled' ).val( 'foo' );
		assert.strictEqual($( '#disabled' )[ 0 ].checkValidity(), true, '#disabled .checkValidity() valid' );
		assert.strictEqual($( '#disabled' )[ 0 ].validity.valid, true, '#disabled .validity.valid valid' );

	});


	module( 'invalid events and disabled controls', lifecycleCVAPI );

	test( 'disabled controls never trigger invalid', function( assert ) {
		assert.expect( 0 );

		$( '#disabled' ).bind( 'invalid.TEST', function() {
			assert.ok(false, 'invalid event detected' );
		});

		// make disabled invalid
		$( '#disabled' ).val( '' );
		$( '#disabled' )[ 0 ].checkValidity(); // should not throw any invalid events

		// teardown
		$( '#disabled' ).unbind( 'invalid.TEST' );

	});


	module( 'submit and disabled controls', lifecycleCVAPI );

	test( 'disabled controls never abort submit', function( assert ) {
		assert.expect( 1 );

		var submitted = 0;
		$( '#test' ).bind( 'submit.TEST', function() {
			submitted++;
			assert.ok(submitted <= 1, 'invalid event detected' );
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

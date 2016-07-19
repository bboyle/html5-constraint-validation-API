(function( $ ) {
	'use strict';

	var module = QUnit.module;
	var test = QUnit.test;

	var	userInitiatedSubmit = function() {
		$( '#test :submit' )[ 0 ].click();
	};

	module( 'environment', lifecycleCVAPI );

	test( 'required fields are in test form', function( assert ) {
		assert.expect( 5 );

		assert.strictEqual($( 'form#test' ).length, 1, 'form#test is present' );
		assert.ok($( 'form#test' ).attr( 'novalidate' ), 'form#test has @novalidate' );
		assert.strictEqual($( 'form#test input#foo' ).length, 1, 'form#test contains input#foo' );
		assert.ok($( 'input#foo' ).attr( 'required' ), 'input#foo has @required' );
		assert.strictEqual($( 'input#foo' ).val(), '', 'input#foo has no value' );

	});


	module( 'invalid events', lifecycleCVAPI );

	test( 'invalid not thrown on submit', function( assert ) {
		assert.expect( 1 );

		var handler = function( event ) {
			assert.ok(false, 'invalid handler should not be triggered' );
			assert.strictEqual(event.target, $( '#foo' )[ 0 ], 'invalid event detected on #foo' );
			event.preventDefault();
		};

		$( '#foo' ).bind( 'invalid', handler );

		userInitiatedSubmit();

		assert.ok(true, 'invalid event not seen' );
	});


	module( 'submit events', lifecycleCVAPI );

	test( 'submit events triggered with invalid fields', function( assert ) {
		assert.expect( 2 );

		var handler = function( event ) {
			assert.ok(true, 'submit event detected' );
			event.preventDefault();
		};

		$( '#foo' ).val( '' );
		$( '#test' ).bind( 'submit', handler );

		userInitiatedSubmit();

		assert.strictEqual($( '#foo' )[ 0 ].validity.valid, false, '#foo is invalid' );

		// teardown
		$( '#test' ).unbind( 'submit', handler );

	});


}( jQuery ));

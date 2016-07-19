(function( $ ) {
	'use strict';

	var module = QUnit.module;
	var test = QUnit.test;

	module( 'environment', lifecycleCVAPI );

	test( 'required fields are in test form', function( assert ) {

		assert.strictEqual($( 'form#test' ).length, 1, 'form#test is present' );
		assert.strictEqual($( 'form#test input#foo' ).length, 1, 'form#test contains input#foo' );
		assert.ok($( 'input#foo' ).attr( 'required' ), 'input#foo has @required' );

	});

	test( 'form submission is counted', function( assert ) {
		assert.expect( 2 );

		var form = $( '#test' ),
			submitted = 0,
			submitDetection = function() {
				submitted++;
				assert.ok(submitted <= 2, 'counting submit event' );
			};
		form.bind( 'submit.TEST', submitDetection );

		// make form valid
		$( '#foo' ).val( 'foo' );

		form.trigger( 'submit' );
		form.find( ':submit' )[ 0 ].click();

		// teardown
		form.unbind( 'submit.TEST' );
	});


	module( 'form submission', lifecycleCVAPI );

	test( 'submit suppressed by invalid fields', function( assert ) {
		assert.expect( 1 );

		var form = $( '#test' ),
			submitDetection = function() {
				assert.ok(false, 'submit event was not suppressed' );
			}
		;

		form.bind( 'submit.TEST', submitDetection );

		// make foo invalid
		$( '#foo' ).val( '' );
		form.trigger( 'submit' );
		assert.strictEqual($( '#foo' )[ 0 ].validity.valid, false, '#foo is invalid' );

		// teardown
		form.unbind( 'submit.TEST' );

	});

	test( 'submit allowed after correcting all invalid fields', function( assert ) {
		assert.expect( 3 );

		var form = $( '#test' ),
			submitted = 0,
			submitDetection = function() {
				submitted++;
				assert.ok(submitted <= 1, 'submit event detected' );
			}
		;

		form.bind( 'submit.TEST', submitDetection );

		// make foo invalid
		$( '#foo' ).val( '' );
		$( '#test' ).trigger( 'submit' );
		assert.strictEqual($( '#foo' )[ 0 ].validity.valid, false, '#foo is invalid' );

		// make foo valid
		$( '#foo' ).val( 'foo' );
		$( '#test :submit' )[ 0 ].click();
		assert.strictEqual($( '#foo' )[ 0 ].validity.valid, true, '#foo is valid' );

		// teardown
		form.unbind( 'submit.TEST' );

	});


}( jQuery ));

(function( $ ) {
	'use strict';

	var module = QUnit.module;
	var test = QUnit.test;

	module( 'environment', lifecycleCVAPI );

	test( 'required fields are in test form', function( assert ) {

		assert.strictEqual($( 'form#test' ).length, 1, 'form#test is present' );
		assert.strictEqual($( 'form#test input#foo' ).length, 1, 'form#test contains input#foo' );
		assert.ok($( 'input#foo' ).attr( 'required' ), 'input#foo has @required' );

		assert.strictEqual($( 'form#test :radio[name=flavour]#flavour-chocolate' ).length, 1, 'found :radio[name=flavour]#flavour-chocolate' );
		assert.strictEqual($( 'form#test :radio[name=flavour]#flavour-strawberry' ).length, 1, 'found :radio[name=flavour]#flavour-strawberry' );
		assert.strictEqual($( 'form#test :radio[name=flavour]#flavour-vanilla' ).length, 1, 'found :radio[name=flavour]#flavour-vanilla' );

		assert.strictEqual($( 'form#test select#select-flavour' ).length, 1, 'found select#select-flavour' );
		assert.ok($( 'select#select-flavour' ).attr( 'required' ), 'select#select-flavour is required' );

	});


	module( 'text onchange', lifecycleCVAPI );

	test( 'validity flagged onchange', function( assert ) {
		assert.expect( 2 );

		// make foo invalid
		$( '#foo' ).val( '' ).trigger( 'change' );
		assert.strictEqual($( '#foo' )[ 0 ].validity.valid, false, '#foo is invalid' );

		// make foo valid
		$( '#foo' ).val( 'foo' ).trigger( 'change' );
		assert.strictEqual($( '#foo' )[ 0 ].validity.valid, true, '#foo is valid' );

	});

	module( 'radio onchange', lifecycleCVAPI );

	test( 'validity flagged onchange', function( assert ) {
		assert.expect( 6 );

		$( '#flavour-chocolate' ).trigger( 'change' );
		assert.strictEqual($( '#flavour-chocolate' )[ 0 ].validity.valid, false, '#flavour-chocolate is invalid' );
		assert.strictEqual($( '#flavour-strawberry' )[ 0 ].validity.valid, false, '#flavour-strawberry is invalid' );
		assert.strictEqual($( '#flavour-vanilla' )[ 0 ].validity.valid, false, '#flavour-vanilla is invalid' );

		// make valid
		$( '#flavour-chocolate' )[ 0 ].click(); // triggers change? not in IE6!
		$( '#flavour-chocolate' ).trigger( 'change' );
		assert.strictEqual($( '#flavour-chocolate' )[ 0 ].validity.valid, true, '#flavour-chocolate is valid' );
		assert.strictEqual($( '#flavour-strawberry' )[ 0 ].validity.valid, true, '#flavour-strawberry is valid' );
		assert.strictEqual($( '#flavour-vanilla' )[ 0 ].validity.valid, true, '#flavour-vanilla is valid' );

	});


	module( 'select onchange', lifecycleCVAPI );

	test( 'validity flagged onchange', function( assert ) {
		assert.expect( 2 );

		$( '#select-flavour' ).trigger( 'change' );
		assert.strictEqual($( '#select-flavour' )[ 0 ].validity.valid, false, '#select-flavour is invalid' );

		// make valid
		$( '#select-flavour' )[ 0 ].selectedIndex = 1; // triggers change? nope
		$( '#select-flavour' ).trigger( 'change' ); // triggers change?
		assert.strictEqual($( '#select-flavour' )[ 0 ].validity.valid, true, '#select-flavour is valid' );

	});


}( jQuery ));

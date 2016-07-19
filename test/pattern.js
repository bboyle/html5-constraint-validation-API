(function( $ ) {
	'use strict';

	var module = QUnit.module;
	var test = QUnit.test;

	module( 'environment', lifecycleCVAPI );

	test( 'pattern fields are in test form', function( assert ) {

		assert.strictEqual($( 'form#test' ).length, 1, 'form#test is present' );
		assert.strictEqual($( 'form#test input#foo' ).length, 1, 'form#test contains input#foo' );
		assert.strictEqual($( 'form#test input#bar' ).length, 1, 'form#test contains input#bar' );
		assert.strictEqual($( 'form#test input#part' ).length, 1, 'form#test contains input#part' );
		assert.strictEqual($( 'form#test input#email' ).length, 1, 'form#test contains input#email' );
		assert.strictEqual($( 'form#test input#email' )[ 0 ].getAttribute( 'type' ), 'email', 'input#email is an email field' );
	});

	test( 'patterns are present', function( assert ) {

		assert.strictEqual($( '[pattern]' )[ 0 ], $( 'input#foo' )[ 0 ], 'input#foo is the first field with a pattern' );
		assert.strictEqual($( '[pattern]' )[ 1 ], $( 'input#bar' )[ 0 ], 'input#bar is the 2nd field with a pattern' );
		assert.strictEqual($( '[pattern]' )[ 2 ], $( 'input#part' )[ 0 ], 'input#part is the 3rd field with a pattern' );
		assert.strictEqual($( '[pattern]' )[ 3 ], $( 'input#email' )[ 0 ], 'input#email is the 4th field with a pattern' );

		assert.strictEqual($( '#foo' ).attr( 'pattern' ), 'foo', '#foo @pattern must match /^foo$/' );
		assert.strictEqual($( '#bar' ).attr( 'pattern' ), '.*bar.*', '#bar @pattern must match /^.*bar.*$/' );

	});


	module( 'input validityState patternMismatch', lifecycleCVAPI );

	test( 'validityState object present', function( assert ) {

		$( '#foo' ).val( '' );
		$( '#foo' )[0].checkValidity();

		assert.strictEqual(typeof $( '#foo' )[ 0 ].validity, 'object', 'validityState is present' );
		assert.strictEqual(typeof $( '#foo' )[ 0 ].validity.patternMismatch, 'boolean', 'validityState.patternMismatch is present' );
		assert.strictEqual(typeof $( '#foo' )[ 0 ].validity.valid, 'boolean', 'validityState.valid is present' );

	});

	test( 'validity.patternMismatch is false when blank', function( assert ) {

		$( '#foo' ).val( '' );
		$( '#foo' )[ 0 ].checkValidity();
		assert.strictEqual($( '#foo' )[ 0 ].validity.patternMismatch, false, '#foo[value=""] validity.patternMismatch should be false' );
		assert.strictEqual($( '#foo' )[ 0 ].validity.valid, true, '#foo[value=""] validity.valid should be true' );
		assert.strictEqual($( '#foo' )[ 0 ].validationMessage, "", '#foo[value=""] validitionMessage should be ""' );

	});

	test( 'validity.patternMismatch is false when pattern matches value', function( assert ) {

		$( '#foo' ).val( 'foo' );
		$( '#foo' )[ 0 ].checkValidity();
		assert.strictEqual($( '#foo' )[ 0 ].validity.patternMismatch, false, '#foo[value="foo"] validity.patternMismatch should be false' );
		assert.strictEqual($( '#foo' )[ 0 ].validity.valid, true, '#foo[value="foo"] validity.valid should be true' );
		assert.strictEqual($( '#foo' )[ 0 ].validationMessage, "", '#foo[value=""] validitionMessage should be ""' );

	});

	test( 'validity.patternMismatch is true when pattern does not match value', function( assert ) {
		assert.expect( 2 );

		$( '#foo' ).val( 'bar' );
		$( '#foo' )[ 0 ].checkValidity();

		assert.strictEqual($( '#foo' )[ 0 ].validity.patternMismatch, true, '#foo[value="bar"] validity.patternMismatch should be true' );
		assert.strictEqual($( '#foo' )[ 0 ].validity.valid, false, '#foo[value="bar"] validity.valid should be false' );
		// in PhantomJS, the below test fails as validationMessage is not defined
		// notStrictEqual( $( '#foo' )[ 0 ].validationMessage, "", '#foo[value=""] validitionMessage should not be an empty string' );

	});

	test( 'validity.patternMismatch is reset when an invalid value is removed', function( assert ) {
		assert.expect( 5 );

		$( '#foo' ).val( 'bar' );
		$( '#foo' )[ 0 ].checkValidity();
		assert.strictEqual($( '#foo' )[ 0 ].validity.patternMismatch, true, '#foo[value="bar"] validity.patternMismatch should be true' );
		assert.strictEqual($( '#foo' )[ 0 ].validity.valid, false, '#foo[value="bar"] validity.valid should be false' );
		// in PhantomJS, the below test fails as validationMessage is not defined
		// notStrictEqual( $( '#foo' )[ 0 ].validationMessage, "", '#foo[value=""] validitionMessage should not be an empty string' );

		$( '#foo' ).val( '' );
		$( '#foo' )[ 0 ].checkValidity();
		assert.strictEqual($( '#foo' )[ 0 ].validity.patternMismatch, false, '#foo[value=""] validity.patternMismatch should be false' );
		assert.strictEqual($( '#foo' )[ 0 ].validity.valid, true, '#foo[value=""] validity.valid should be true' );
		assert.strictEqual($( '#foo' )[ 0 ].validationMessage, "", '#foo[value=""] validitionMessage should be ""' );

	});


	test( 'validity.patternMismatch toggles as value is changed', function( assert ) {

		$( '#foo' ).val( 'bar' );
		$( '#foo' )[ 0 ].checkValidity();
		assert.strictEqual($( '#foo' )[ 0 ].validity.patternMismatch, true, '#foo[value="bar"] validity.patternMismatch should be true' );
		assert.strictEqual($( '#foo' )[ 0 ].validity.valid, false, '#foo[value="bar"] validity.valid should be false' );

		$( '#foo' ).val( 'foo' );
		$( '#foo' )[ 0 ].checkValidity();
		assert.strictEqual($( '#foo' )[ 0 ].validity.patternMismatch, false, '#foo[value="foo"] validity.patternMismatch should be false' );
		assert.strictEqual($( '#foo' )[ 0 ].validity.valid, true, '#foo[value="foo"] validity.valid should be true' );

		$( '#foo' ).val( 'bar' );
		$( '#foo' )[ 0 ].checkValidity();
		assert.strictEqual($( '#foo' )[ 0 ].validity.patternMismatch, true, '#foo[value="bar"] validity.patternMismatch should be true' );
		assert.strictEqual($( '#foo' )[ 0 ].validity.valid, false, '#foo[value="bar"] validity.valid should be false' );

	});


	module( '@pattern behaviour', lifecycleCVAPI );

	test( 'patterns are anchored', function( assert ) {

		$( '#foo' ).val( 'foobarfoo' );
		$( '#foo' )[ 0 ].checkValidity();
		assert.strictEqual($( '#foo' )[ 0 ].validity.patternMismatch, true, '#foo[value="foobarfoo"] validity.patternMismatch should be true' );
		assert.strictEqual($( '#foo' )[ 0 ].validity.valid, false, '#foo[value="foobarfoo"] validity.valid should be false' );

		$( '#bar' ).val( 'bar' );
		$( '#bar' )[ 0 ].checkValidity();
		assert.strictEqual($( '#bar' )[ 0 ].validity.patternMismatch, false, '#bar[value="bar"] validity.patternMismatch should be false' );
		assert.strictEqual($( '#bar' )[ 0 ].validity.valid, true, '#bar[value="bar"] validity.valid should be true' );

		$( '#bar' ).val( 'foobarfoo' );
		$( '#bar' )[ 0 ].checkValidity();
		assert.strictEqual($( '#bar' )[ 0 ].validity.patternMismatch, false, '#bar[value="foobarfoo"] validity.patternMismatch should be false' );
		assert.strictEqual($( '#bar' )[ 0 ].validity.valid, true, '#bar[value="foobarfoo"] validity.valid should be true' );

	});

	test( 'regexp parsing is correct', function( assert ) {

		// valid part numbers
		$.each( [ '1ABC', '3BEN', '0ZZZ' ], function( index, element ) {
			$( '#part' ).val( element );
			$( '#part' )[ 0 ].checkValidity();
			assert.strictEqual($( '#part' )[ 0 ].validity.patternMismatch, false, '#part[value="' + element + '"] validity.patternMismatch should be false' );
			assert.strictEqual($( '#part' )[ 0 ].validity.valid, true, '#part[value="' + element + '"] validity.valid should be true' );
		});

		// invalid part numbers
		$.each( [ '0', '123', '1abc', '1ABCD', '00ZZZ' ], function( index, element ) {
			$( '#part' ).val( element );
			$( '#part' )[ 0 ].checkValidity();
			assert.strictEqual($( '#part' )[ 0 ].validity.patternMismatch, true, '#part[value="' + element + '"] validity.patternMismatch should be true' );
			assert.strictEqual($( '#part' )[ 0 ].validity.valid, false, '#part[value="' + element + '"] validity.valid should be false' );
		});

	});

	test( 'email @pattern', function( assert ) {

		// valid email patterns
		$.each( [ 'a@b.example.com', 'benjamins.boyle@gmail.example.com' ], function( index, element ) {
			$( '#email' ).val( element );
			$( '#email' )[ 0 ].checkValidity();
			assert.strictEqual($( '#email' )[ 0 ].validity.typeMismatch, false, '#email[value="' + element + '"] validity.typeMismatch should be false' );
			assert.strictEqual($( '#email' )[ 0 ].validity.patternMismatch, false, '#email[value="' + element + '"] validity.patternMismatch should be false' );
			assert.strictEqual($( '#email' )[ 0 ].validity.valid, true, '#email[value="' + element + '"] validity.valid should be true' );
		});

		// invalid email patterns
		$.each( [ 'a@b.com', 'foo@gmail.com' ], function( index, element ) {
			$( '#email' ).val( element );
			$( '#email' )[ 0 ].checkValidity();
			assert.strictEqual($( '#email' )[ 0 ].validity.typeMismatch, false, '#email[value="' + element + '"] validity.typeMismatch should be false' );
			assert.strictEqual($( '#email' )[ 0 ].validity.patternMismatch, true, '#email[value="' + element + '"] validity.patternMismatch should be true' );
			assert.strictEqual($( '#email' )[ 0 ].validity.valid, false, '#email[value="' + element + '"] validity.valid should be false' );
		});

		// invalid email address
		$.each( [ 'foo', '@' ], function( index, element ) {
			$( '#email' ).val( element );
			$( '#email' )[ 0 ].checkValidity();
			assert.strictEqual($( '#email' )[ 0 ].validity.typeMismatch, true, '#email[value="' + element + '"] validity.typeMismatch should be true' );
			assert.strictEqual($( '#email' )[ 0 ].validity.patternMismatch, true, '#email[value="' + element + '"] validity.patternMismatch should be true' );
			assert.strictEqual($( '#email' )[ 0 ].validity.valid, false, '#email[value="' + element + '"] validity.valid should be false' );
		});

	});


}( jQuery ));

(function( $ ) {
	'use strict';

	var module = QUnit.module;
	var test = QUnit.test;

	module( 'environment', lifecycleCVAPI );

	test( 'required fields are in test form', function( assert ) {
		assert.expect( 6 );

		assert.strictEqual($( 'form#test' ).length, 1, 'form#test is present' );
		assert.strictEqual($( 'input#foo', '#test' ).length, 1, 'form#test contains input#foo' );
		assert.strictEqual($( 'select#select-foo', '#test' ).length, 1, 'form#test contains select#select-foo' );
		assert.strictEqual($( ':radio[name=radioFoo]', '#test' ).length, 5, 'form#test contains 5 radio buttons in radioFoo group' );
		assert.strictEqual($( 'textarea#textarea-foo', '#test' ).length, 1, 'form#test contains textarea#textarea-foo' );
		assert.strictEqual($( ':checkbox[name=checkbox]', '#test' ).length, 1, 'form#test contains 1 checkbox' );

	});

	test( 'required fields are present', function( assert ) {
		assert.expect( 3 );

		assert.strictEqual($( '[required]' )[ 0 ], $( 'input#foo' )[ 0 ], 'input#foo is the first required field' );
		assert.strictEqual($( '[required]' )[ 1 ], $( 'select#select-foo' )[ 0 ], 'select#select-foo is the second required field' );
		assert.ok($( ':checkbox#checkbox' ).is( '[required]' ), ':checkbox#checkbox is required' );

	});

	test( 'browser can report required fields', function( assert ) {
		assert.expect( 2 );

		assert.ok($( 'input#foo' ).attr( 'required' ), 'input#foo.attr( "required" )' );
		assert.ok($( '#checkbox' ).attr( 'required' ), '#checkbox.attr( "required" )' );
		// fails in FF3.6 (OSX)
		// assert.ok($( 'input#foo' )[ 0 ].required, 'input#foo[ 0 ].required' );
		// fails in IE6
		// assert.ok($( 'input#foo' )[ 0 ].hasAttribute( 'required' ), 'input#foo[ 0 ].hasAttribute( "required" )' );

	});

	test( 'no radio buttons are checked', function( assert ) {
		assert.expect( 3 );

		assert.strictEqual($( ':radio[name="radioFoo"]:checked' ).length, 0, 'radio buttons in "radioFoo" group should not be checked' );
		assert.strictEqual($( ':radio[name="radioBar"]:checked' ).length, 1, '1 radio button in "radioBar" group checked' );
		assert.strictEqual($( ':radio[name="radioBar"]:checked' ).attr( 'id' ), 'radioFoo', 'checked radio button in "radioBar" group has id="radioFoo"' );

	});


	module( 'input validityState valueMissing', lifecycleCVAPI );

	test( 'validityState object present', function( assert ) {

		$( '#foo' ).val( '' );

		assert.strictEqual(typeof $( '#foo' )[ 0 ].validity, 'object', 'validityState is present' );
		assert.strictEqual(typeof $( '#foo' )[ 0 ].validity.valueMissing, 'boolean', 'validityState.valueMissing is present' );
		assert.strictEqual(typeof $( '#foo' )[ 0 ].validity.valid, 'boolean', 'validityState.valid is present' );

	});

	test( 'validity.valueMissing is true when blank', function( assert ) {

		$( '#foo' ).val( '' );
		$( '#foo' )[ 0 ].checkValidity();
		assert.strictEqual($( '#foo' )[ 0 ].validity.valueMissing, true, '#foo[value=""] validity.valueMissing should be true' );

		// test blank values
		$.each( [null, undefined], function( index, element ) {

			$( '#foo' ).val( element );
			$( '#foo' )[ 0 ].checkValidity();
			assert.strictEqual($( '#foo' )[ 0 ].validity.valueMissing, true, '#foo[value="' + element + '"] validity.valueMissing should be true' );

		});

	});

	test( 'validity.valid is false when blank', function( assert ) {

		$( '#foo' ).val( '' );
		$( '#foo' )[ 0 ].checkValidity();
		assert.strictEqual($( '#foo' )[ 0 ].validity.valid, false, '#foo[value=""] validity.valid should be false' );

	});

	test( 'validity.valueMissing is false when there is a value', function( assert ) {

		$( '#foo' ).val( 'foo' );
		$( '#foo' )[ 0 ].checkValidity();
		assert.strictEqual($( '#foo' )[ 0 ].validity.valueMissing, false, '#foo[value="foo"] validity.valueMissing should be false' );

		// test "falsey" values
		$.each( [ '0', 0, '""', 'null', 'undefined' ], function( index, element ){

			$( '#foo' ).val( element );
			$( '#foo' )[ 0 ].checkValidity();
			assert.strictEqual($( '#foo' )[ 0 ].validity.valueMissing, false, '#foo[value="' + element + '"] validity.valueMissing should be false' );

		});

	});


	module( 'select validityState valueMissing', lifecycleCVAPI );

	test( 'validity.valueMissing is true when blank', function( assert ) {

		$( '#select-foo' ).find( 'option[value=""]' ).attr( 'selected', 'selected' );
		$( '#select-foo' )[ 0 ].checkValidity();
		assert.strictEqual($( '#select-foo' )[ 0 ].validity.valueMissing, true, '#select-foo validity.valueMissing should be true' );

	});

	test( 'validity.valid is false when blank', function( assert ) {

		$( '#select-foo' )[ 0 ].selectedIndex = 0;
		$( '#select-foo' )[ 0 ].checkValidity();
		assert.strictEqual($( '#select-foo' )[ 0 ].validity.valid, false, '#select-foo validity.valid should be false' );

	});

	test( 'validity.valueMissing is false when a value is selected', function( assert ) {

		$( '#select-foo' )[ 0 ].selectedIndex = 1;
		$( '#select-foo' )[ 0 ].checkValidity();
		assert.strictEqual($( '#select-foo' )[ 0 ].validity.valueMissing, false, '#select-foo validity.valueMissing should be false' );

	});


	module( 'radio validityState valueMissing', lifecycleCVAPI );

	test( 'validity.valueMissing is true when blank', function( assert ) {

		$( '#radio-foo-foo' )[ 0 ].checkValidity();
		$( '#radio-foo-bar' )[ 0 ].checkValidity();
		assert.strictEqual($( '#radio-foo-foo' )[ 0 ].validity.valueMissing, true, '#radio-foo-foo validity.valueMissing should be true' );
		// fails in IE11 which doesn't seem to care that the radio *group* is required?
		// assert.strictEqual($( '#radio-foo-bar' )[ 0 ].validity.valueMissing, true, '#radio-foo-bar validity.valueMissing should be true' );

	});

	test( 'validity.valid is false when blank', function( assert ) {

		$( '#radio-foo-foo' )[ 0 ].checkValidity();
		assert.strictEqual($( '#radio-foo-foo' )[ 0 ].validity.valid, false, '#radio-foo-foo validity.valid should be false' );
		// fails in IE11 which doesn't seem to care that the radio *group* is required?
		// assert.strictEqual($( '#radio-foo-bar' )[ 0 ].validity.valid, false, '#radio-foo-bar validity.valid should be false' );

	});
	test( 'validity.valueMissing is false when an item is checked', function( assert ) {

		$( '#radio-foo-foo' ).attr( 'checked', 'checked' );
		$( '#radio-foo-foo' )[ 0 ].checkValidity();
		$( '#test :radio[name=radioFoo]' ).each(function() {
			assert.strictEqual(this.validity.valueMissing, false, '#' + this.id + ' validity.valueMissing should be false' );
		});

	});

	test( 'validity.valueMissing is false when an item with empty value is checked', function( assert ) {

		assert.strictEqual($( '#radio-foo-BLANK' ).val(), '', '#radio-foo-BLANK value is ""' );

		$( '#radio-foo-BLANK' ).attr( 'checked', 'checked' );
		$( '#radio-foo-BLANK' )[ 0 ].checkValidity();
		$( '#test :radio[name=radioFoo]' ).each(function() {
			assert.strictEqual(this.validity.valueMissing, false, '#' + this.id + ' validity.valueMissing should be false' );
		});

	});


	module( 'textarea validityState valueMissing', lifecycleCVAPI );

	test( 'validity.valueMissing is true when blank', function( assert ) {

		$( '#textarea-foo' ).val( '' );
		$( '#textarea-foo' )[ 0 ].checkValidity();
		assert.strictEqual($( '#textarea-foo' )[ 0 ].validity.valueMissing, true, '#textarea-foo validity.valueMissing should be true' );

	});

	test( 'validity.valid is false when blank', function( assert ) {

		$( '#textarea-foo' ).val( '' );
		$( '#textarea-foo' )[ 0 ].checkValidity();
		assert.strictEqual($( '#textarea-foo' )[ 0 ].validity.valid, false, '#textarea-foo validity.valid should be false' );

	});


	test( 'validity.valueMissing is false when a value is present', function( assert ) {

		$( '#textarea-foo' ).val( 'foo' );
		$( '#textarea-foo' )[ 0 ].checkValidity();
		assert.strictEqual($( '#textarea-foo' )[ 0 ].validity.valueMissing, false, '#textarea-foo validity.valueMissing should be false' );

	});


	module( 'single checkbox validityState valueMissing', lifecycleCVAPI );

	test( 'checkbox validityState when not checked', function( assert ) {
		assert.expect( 3 );

		$( '#checkbox' )[ 0 ].checkValidity();
		assert.strictEqual($( '#checkbox' )[ 0 ].checked, false, '#checkbox is not checked' );
		assert.strictEqual($( '#checkbox' )[ 0 ].validity.valueMissing, true, '#checkbox validity.valueMissing should be true' );
		assert.strictEqual($( '#checkbox' )[ 0 ].validity.valid, false, '#checkbox validity.valid should be false' );

	});

	test( 'checkbox validityState when checked', function( assert ) {
		assert.expect( 3 );

		$( '#checkbox' ).attr( 'checked', 'checked' );
		$( '#checkbox' )[ 0 ].checkValidity();
		assert.strictEqual($( '#checkbox' )[ 0 ].checked, true, '#checkbox is checked' );
		assert.strictEqual($( '#checkbox' )[ 0 ].validity.valueMissing, false, '#checkbox validity.valueMissing should be false' );
		assert.strictEqual($( '#checkbox' )[ 0 ].validity.valid, true, '#checkbox validity.valid should be true' );

	});

}( jQuery ));

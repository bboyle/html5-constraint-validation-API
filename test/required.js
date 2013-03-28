(function( $ ) {
	'use strict';
	
	module( 'environment', lifecycleCVAPI );

	test( 'required fields are in test form', function() {

		strictEqual( $( 'form#test' ).length, 1, 'form#test is present' );
		strictEqual( $( 'form#test input#foo' ).length, 1, 'form#test contains input#foo' );
		strictEqual( $( 'form#test select#select-foo' ).length, 1, 'form#test contains select#select-foo' );
		strictEqual( $( 'form#test :radio[name=radioFoo]' ).length, 5, 'form#test contains 5 radio buttons in radioFoo group' );
		strictEqual( $( 'form#test textarea#textarea-foo' ).length, 1, 'form#test contains textarea#textarea-foo' );

	});

	test( 'required fields are present', function() {

		strictEqual( $( '[required]' )[0], $( 'input#foo' )[0], 'input#foo is the first required field' );
		strictEqual( $( '[required]' )[1], $( 'select#select-foo' )[0], 'select#select-foo is the second required field' );

	});

	test( 'browser can report required fields', function() {
		
		ok( $( 'input#foo' ).attr( 'required' ), 'input#foo.attr( "required" )' );
		// fails in FF3.6 (OSX)
		// ok( $( 'input#foo' )[0].required, 'input#foo[0].required' );
		// fails i IE6
		// ok( $( 'input#foo' )[0].hasAttribute( 'required' ), 'input#foo[0].hasAttribute( "required" )' );

	});

	test( 'no radio buttons are checked', function() {

		$( 'form#test :radio' ).each(function() {
			this.checked = false;
		});
		strictEqual( $( 'form#test :radio[checked]' ).length, 0, 'form#test radio buttons should not be checked' );

	});


	module( 'input validityState valueMissing', lifecycleCVAPI );

	test( 'validityState object present', function() {
		
		$( '#foo' ).val( '' );
		$( '#foo' )[0].checkValidity();

		strictEqual( typeof $( '#foo' )[0].validity, 'object', 'validityState is present' );
		strictEqual( typeof $( '#foo' )[0].validity.valueMissing, 'boolean', 'validityState.valueMissing is present' );
		strictEqual( typeof $( '#foo' )[0].validity.valid, 'boolean', 'validityState.valid is present' );

	});

	test( 'validity.valueMissing is true when blank', function() {
		
		$( '#foo' ).val( '' );
		$( '#foo' )[0].checkValidity();
		strictEqual( $( '#foo' )[0].validity.valueMissing, true, '#foo[value=""] validity.valueMissing should be true' );

		// test blank values
		$.each( [null, undefined], function( index, element ) {

			$( '#foo' ).val( element );
			$( '#foo' )[0].checkValidity();
			strictEqual( $( '#foo' )[0].validity.valueMissing, true, '#foo[value="' + element + '"] validity.valueMissing should be true' );

		});

	});

	test( 'validity.valid is false when blank', function() {
		
		$( '#foo' ).val( '' );
		$( '#foo' )[0].checkValidity();
		strictEqual( $( '#foo' )[0].validity.valid, false, '#foo[value=""] validity.valid should be false' );

	});

	test( 'validity.valueMissing is false when there is a value', function() {
		
		$( '#foo' ).val( 'foo' );
		$( '#foo' )[0].checkValidity();
		strictEqual( $( '#foo' )[0].validity.valueMissing, false, '#foo[value="foo"] validity.valueMissing should be false' );

		// test "falsey" values
		$.each( [ '0', 0, '""', 'null', 'undefined' ], function( index, element ){

			$( '#foo' ).val( element );
			$( '#foo' )[0].checkValidity();
			strictEqual( $( '#foo' )[0].validity.valueMissing, false, '#foo[value="' + element + '"] validity.valueMissing should be false' );

		});

	});


	module( 'select validityState valueMissing', lifecycleCVAPI );

	test( 'validity.valueMissing is true when blank', function() {
		
		$( '#select-foo' ).find( 'option[value=""]' ).attr( 'selected', 'selected' );
		$( '#select-foo' )[0].checkValidity();
		strictEqual( $( '#select-foo' )[0].validity.valueMissing, true, '#select-foo validity.valueMissing should be true' );

	});

	test( 'validity.valid is false when blank', function() {
		
		$( '#select-foo' )[0].selectedIndex = 0;
		$( '#select-foo' )[0].checkValidity();
		strictEqual( $( '#select-foo' )[0].validity.valid, false, '#select-foo validity.valid should be false' );

	});

	test( 'validity.valueMissing is false when a value is selected', function() {
		
		$( '#select-foo' )[0].selectedIndex = 1;
		$( '#select-foo' )[0].checkValidity();
		strictEqual( $( '#select-foo' )[0].validity.valueMissing, false, '#select-foo validity.valueMissing should be false' );

	});


	module( 'radio validityState valueMissing', lifecycleCVAPI );

	test( 'validity.valueMissing is true when blank', function() {
		
		$( '#radio-foo-foo' )[0].checkValidity();
		strictEqual( $( '#radio-foo-foo' )[0].validity.valueMissing, true, '#radio-foo-foo validity.valueMissing should be true' );

	});

	test( 'validity.valid is false when blank', function() {
		
		$( '#radio-foo-foo' )[0].checkValidity();
		strictEqual( $( '#radio-foo-foo' )[0].validity.valid, false, '#radio-foo-foo validity.valueMissing should be false' );

	});

	test( 'validity.valueMissing is false when an item is checked', function() {
		
		$( '#radio-foo-foo' ).attr( 'checked', 'checked' );
		$( '#radio-foo-foo' )[0].checkValidity();
		$( '#test :radio[name=radioFoo]' ).each(function() {
			strictEqual( this.validity.valueMissing, false, '#' + this.id + ' validity.valueMissing should be false' );		
		});

	});

	test( 'validity.valueMissing is false when an item with empty value is checked', function() {
		
		strictEqual( $( '#radio-foo-BLANK' ).val(), '', '#radio-foo-BLANK value is ""' );

		$( '#radio-foo-BLANK' ).attr( 'checked', 'checked' );
		$( '#radio-foo-BLANK' )[0].checkValidity();
		$( '#test :radio[name=radioFoo]' ).each(function() {
			strictEqual( this.validity.valueMissing, false, '#' + this.id + ' validity.valueMissing should be false' );		
		});

	});


	module( 'textarea validityState valueMissing', lifecycleCVAPI );

	test( 'validity.valueMissing is true when blank', function() {
		
		$( '#textarea-foo' ).val( '' );
		$( '#textarea-foo' )[0].checkValidity();
		strictEqual( $( '#textarea-foo' )[0].validity.valueMissing, true, '#textarea-foo validity.valueMissing should be true' );

	});

	test( 'validity.valid is false when blank', function() {
		
		$( '#textarea-foo' ).val( '' );
		$( '#textarea-foo' )[0].checkValidity();
		strictEqual( $( '#textarea-foo' )[0].validity.valid, false, '#textarea-foo validity.valid should be false' );

	});


	test( 'validity.valueMissing is false when a value is present', function() {
		
		$( '#textarea-foo' ).val( 'foo' );
		$( '#textarea-foo' )[0].checkValidity();
		strictEqual( $( '#textarea-foo' )[0].validity.valueMissing, false, '#textarea-foo validity.valueMissing should be false' );

	});


}( jQuery ));

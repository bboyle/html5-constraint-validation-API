(function( $ ) {
	'use strict';
	
	module( 'environment', lifecycleCVAPI );

	test( 'required fields are in test form', function() {

		strictEqual( $( 'form#test' ).length, 1, 'form#test is present' );
		strictEqual( $( 'form#test input#foo' ).length, 1, 'form#test contains input#foo' );
		ok( $( 'input#foo' ).attr( 'required' ), 'input#foo has @required' );

		strictEqual( $( 'form#test :radio[name=flavour]#flavour-chocolate' ).length, 1, 'found :radio[name=flavour]#flavour-chocolate' );
		strictEqual( $( 'form#test :radio[name=flavour]#flavour-strawberry' ).length, 1, 'found :radio[name=flavour]#flavour-strawberry' );
		strictEqual( $( 'form#test :radio[name=flavour]#flavour-vanilla' ).length, 1, 'found :radio[name=flavour]#flavour-vanilla' );

		strictEqual( $( 'form#test select#select-flavour' ).length, 1, 'found select#select-flavour' );
		ok( $( 'select#select-flavour' ).attr( 'required' ), 'select#select-flavour is required' );

	});


	module( 'text onchange', lifecycleCVAPI );

	test( 'validity flagged onchange', 2, function() {

		// make foo invalid
		$( '#foo' ).val( '' ).trigger( 'change' );
		strictEqual( $( '#foo' )[ 0 ].validity.valid, false, '#foo is invalid' );

		// make foo valid
		$( '#foo' ).val( 'foo' ).trigger( 'change' );
		strictEqual( $( '#foo' )[ 0 ].validity.valid, true, '#foo is valid' );
		
	});


	module( 'radio onchange', lifecycleCVAPI );

	test( 'validity flagged onchange', 6, function() {

		$( '#flavour-chocolate' ).trigger( 'change' );
		strictEqual( $( '#flavour-chocolate' )[ 0 ].validity.valid, false, '#flavour-chocolate is invalid' );
		strictEqual( $( '#flavour-strawberry' )[ 0 ].validity.valid, false, '#flavour-strawberry is invalid' );
		strictEqual( $( '#flavour-vanilla' )[ 0 ].validity.valid, false, '#flavour-vanilla is invalid' );

		// make valid
		$( '#flavour-chocolate' )[ 0 ].click(); // triggers change? not in IE6!
		$( '#flavour-chocolate' ).trigger( 'change' );
		strictEqual( $( '#flavour-chocolate' )[ 0 ].validity.valid, true, '#flavour-chocolate is valid' );
		strictEqual( $( '#flavour-strawberry' )[ 0 ].validity.valid, true, '#flavour-strawberry is valid' );
		strictEqual( $( '#flavour-vanilla' )[ 0 ].validity.valid, true, '#flavour-vanilla is valid' );
		
	});


	module( 'select onchange', lifecycleCVAPI );

	test( 'validity flagged onchange', 2, function() {

		$( '#select-flavour' ).trigger( 'change' );
		strictEqual( $( '#select-flavour' )[ 0 ].validity.valid, false, '#select-flavour is invalid' );

		// make valid
		$( '#select-flavour' )[ 0 ].selectedIndex = 1; // triggers change? nope
		$( '#select-flavour' ).trigger( 'change' ); // triggers change?
		strictEqual( $( '#select-flavour' )[ 0 ].validity.valid, true, '#select-flavour is valid' );
		
	});


}( jQuery ));

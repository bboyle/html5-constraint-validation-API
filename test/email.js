(function( $ ) {
	'use strict';
	
	function testEmail( value, valid ) {
		var email = $( '#email' );

		if ( valid !== false ) {
			valid = true;
		}

		email.val( value );
		email[ 0 ].checkValidity();
		strictEqual( ! email[ 0 ].validity.typeMismatch, valid, value + ' is valid' );
	}



	module( 'environment', lifecycleCVAPI );

	test( 'email fields are in test form', function() {

		strictEqual( $( 'form#test' ).length, 1, 'form#test is present' );
		strictEqual( $( 'form#test input#foo' ).length, 1, 'form#test contains input#foo' );
		strictEqual( $( 'form#test input#email' ).length, 1, 'form#test contains input#email' );

	});

	test( 'email fields are type email', function() {

		strictEqual( $( '#foo' )[ 0 ].type, 'text', 'input#foo is type text' );
		strictEqual( $( '#email' )[ 0 ].getAttribute( 'type' ), 'email', 'input#email is type email' );

	});


	module( 'input validityState typeMismatch', lifecycleCVAPI );

	test( 'validity.typeMismatch is false when blank', function() {
		
		$( '#email,#foo' ).val( '' );
		$( '#email' )[ 0 ].checkValidity();
		$( '#foo' )[ 0 ].checkValidity();

		strictEqual( $( '#email' )[ 0 ].validity.typeMismatch, false, '#email[value=""] validity.typeMismatch should be false' );
		strictEqual( $( '#email' )[ 0 ].validity.valid, true, '#email[value=""] validity.valid should be true' );
		strictEqual( $( '#foo' )[ 0 ].validity.typeMismatch, false, '#foo[value=""] validity.typeMismatch should be false' );

	});

	test( 'validity.typeMismatch is true when value is not an email address', function() {
		
		$( '#email, #foo' ).val( 'foo' );
		$( '#email' )[ 0 ].checkValidity();
		$( '#foo' )[ 0 ].checkValidity();

		strictEqual( $( '#email' )[ 0 ].validity.typeMismatch, true, '#email[value="foo"] validity.typeMismatch should be true' );
		strictEqual( $( '#email' )[ 0 ].validity.valid, false, '#email[value=""] validity.valid should be false' );
		strictEqual( $( '#foo' )[ 0 ].validity.typeMismatch, false, '#foo[value="foo"] validity.typeMismatch should be false' );

	});


	test( 'validity.typeMismatch is false when an email address is supplied', function() {
		
		$( '#email,#foo' ).val( 'foo@example.com' );
		$( '#email' )[ 0 ].checkValidity();
		$( '#foo' )[ 0 ].checkValidity();

		strictEqual( $( '#email' )[ 0 ].validity.typeMismatch, false, '#email[value="foo@example.com"] validity.typeMismatch should be false' );
		strictEqual( $( '#email' )[ 0 ].validity.valid, true, '#email[value=""] validity.valid should be true' );
		strictEqual( $( '#foo' )[ 0 ].validity.typeMismatch, false, '#foo[value="foo@example.com"] validity.typeMismatch should be false' );

	});


	test( 'standard email formats', 2, function() {

		var formats = [
			'benjamins.boyle@gmail.com',
			'fred.flintstone@hostname.example.com'
		];

		$.each( formats, function( indexInArray, valueOfElement ) {
			testEmail( valueOfElement );
		});

	});

	test( 'unusual email formats', 1, function() {

		var formats = [
			// TODO why do these fail in PhantomJS?
			// 'foo@localhost',
			// 'a@b',
			'foo@127.0.0.1'
		];

		$.each( formats, function( indexInArray, valueOfElement ) {
			testEmail( valueOfElement );
		});

	});

	test( 'allowed complex email formats', 4, function() {
		
		// http://haacked.com/archive/2007/08/21/i-knew-how-to-validate-an-email-address-until-i.aspx
		var formats = [
			'customer/department=shipping@example.com',
			'$A12345@example.com',
			'!def!xyz%abc@example.com',
			'_somename@example.com'
		];

		$.each( formats, function( indexInArray, valueOfElement ) {
			testEmail( valueOfElement );
		});

	});

	test( 'disallowed complex email formats', 4, function() {
		
		// html5 does not allow these formats
		// http://www.whatwg.org/specs/web-apps/current-work/multipage/states-of-the-type-attribute.html#valid-e-mail-address
		
		// http://haacked.com/archive/2007/08/21/i-knew-how-to-validate-an-email-address-until-i.aspx
		var formats = [
			'"Abc\\@def"@example.com',
			'"Fred Bloggs"@example.com',
			'"Joe\\\\Blow"@example.com',
			'"Abc@def"@example.com'
		];

		$.each( formats, function( indexInArray, valueOfElement ) {
			testEmail( valueOfElement, false );
		});

	});


}( jQuery ));

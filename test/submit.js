(function( $ ) {
	'use strict';
	
	module( 'environment', lifecycleCVAPI );

	test( 'required fields are in test form', function() {

		strictEqual( $( 'form#test' ).length, 1, 'form#test is present' );
		strictEqual( $( 'form#test input#foo' ).length, 1, 'form#test contains input#foo' );
		ok( $( 'input#foo' ).attr( 'required' ), 'input#foo has @required' );

	});

	test( 'form submission is counted', 2, function() {

		var form = $( '#test' ),
			submitted = 0,
			submitDetection = function() {
				submitted++;
				ok( submitted <= 2, 'counting submit event' );	
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

	test( 'submit suppressed by invalid fields', 1, function() {

		var form = $( '#test' ),
			submitDetection = function() {
				ok( false, 'submit event was not suppressed' );
			}
		;

		form.bind( 'submit.TEST', submitDetection );

		// make foo invalid
		$( '#foo' ).val( '' );
		form.trigger( 'submit' );
		strictEqual( $( '#foo' )[ 0 ].validity.valid, false, '#foo is invalid' );

		// teardown
		form.unbind( 'submit.TEST' );
		
	});

	test( 'submit allowed after correcting all invalid fields', 3, function() {

		var form = $( '#test' ),
			submitted = 0,
			submitDetection = function() {
				submitted++;
				ok( submitted <= 1, 'submit event detected' );	
			}
		;
		
		form.bind( 'submit.TEST', submitDetection );

		// make foo invalid
		$( '#foo' ).val( '' );
		$( '#test' ).trigger( 'submit' );
		strictEqual( $( '#foo' )[ 0 ].validity.valid, false, '#foo is invalid' );

		// make foo valid
		$( '#foo' ).val( 'foo' );
		$( '#test :submit' )[ 0 ].click();
		strictEqual( $( '#foo' )[ 0 ].validity.valid, true, '#foo is valid' );

		// teardown
		form.unbind( 'submit.TEST' );
		
	});


}( jQuery ));

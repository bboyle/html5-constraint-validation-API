/*
	forces Constraint Validation API

	helpers for the HTML5 constraint validation API

*/

if ( jQuery !== 'undefined' ) {
(function( $ ){
	'use strict';


	// INPUT validity API not implemented in browser
	if ( typeof $( '<input>' )[0].validity !== 'object' ) {

		// http://www.whatwg.org/specs/web-apps/current-work/multipage/states-of-the-type-attribute.html#valid-e-mail-address
		// 1*( atext / "." ) "@" ldh-str 1*( "." ldh-str )
		var REXP_EMAIL = /^[A-Za-z0-9!#$%&'*+\-\/=\?\^_`\{\|\}~\.]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+$/,

			invalidCount = 0,

			validityState = function( typeMismatch, valueMissing ) {
				var valid = ! typeMismatch && ! valueMissing;
				if ( valid === false ) {
					invalidCount = invalidCount + 1;
				}
				return {
					typeMismatch: typeMismatch,
					valueMissing: valueMissing,
					valid: valid
				};
			}
		;


		// check for blank required fields on submit
		$( 'form' ).live( 'submit', function() {

			var form = $( this ),
				invalidEvent = $.Event( 'invalid' )
			;

			// invalid events do not bubble
			invalidEvent.stopImmediatePropagation();

			// check required fields
			form.find( ':text, select, textarea' ).each(function() {

				var $this = $( this ),

					isBlank = $this.attr( 'required' ) && ! this.value,

					invalidEmail = this.getAttribute( 'type' ) === 'email' && !! this.value && ! REXP_EMAIL.test( this.value )
				;

				this.validity = validityState( invalidEmail, isBlank );

				if ( !this.validity.valid ) {
					// invalid event
					$this.trigger( invalidEvent );
				}

			});

			// check required radio button groups
			(function() {
				
				var names = {};

				form.find( ':radio[required]' ).each(function() {

					if ( names[ this.name ] !== true ) {
						
						var group = form.find( ':radio[name=' + this.name + ']' ),
							isBlank = group.filter( ':checked' ).length === 0;

						group.each(function() {
							this.validity = validityState( false, isBlank );
						});

						names[ this.name ] = true;

						// TODO research "invalid" events for radio buttons for correct emulation
						// are events thrown for each button or once for the group?
						if ( isBlank === true ) {
							$( this ).trigger( invalidEvent );
						}
					}
				});

			}());

		});

	}


	// suppress submit if invalid fields exist
	// required for Opera 11.5 on OSX
	$( 'form' ).live( 'submit', function( event ) {
		if ( $( this ).find( 'input, select, textarea' ).filter(function() {
			return this.validity && ! this.validity.valid;
		}).length > 0 ) {
			
			event.stopImmediatePropagation();
			event.preventDefault();
			return false;
		}
	});


}( jQuery ));
}

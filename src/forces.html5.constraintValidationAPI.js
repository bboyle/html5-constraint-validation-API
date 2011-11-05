/*
	forces Constraint Validation API

	helpers for the HTML5 constraint validation API

*/

if ( jQuery !== 'undefined' ) {
(function( $ ){
	'use strict';


	// http://www.whatwg.org/specs/web-apps/current-work/multipage/states-of-the-type-attribute.html#valid-e-mail-address
	// 1*( atext / "." ) "@" ldh-str 1*( "." ldh-str )
	var REXP_EMAIL = /^[A-Za-z0-9!#$%&'*+\-\/=\?\^_`\{\|\}~\.]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+$/,

		input = $( '<input>' ),

		// TODO abstract this, maybe into .checkValidity (without event trigger)
		// so that it also sets .validationMessage and .willValidate
		validityState = function( typeMismatch, valueMissing, message ) {
			var customError = !! message,
				valid = ! typeMismatch && ! valueMissing && ! customError;
			return {
				customError: customError,
				typeMismatch: !! typeMismatch,
				valueMissing: !! valueMissing,
				valid: valid
			};
		}
	;


	// INPUT setCustomValidity
	if ( typeof input[ 0 ].setCustomValidity !== 'function' ) {
		// set initial validity
		$( 'input' ).each(function() {
			var that = this;

			that.validity = validityState( false, false, '' );
			that.validationMessage = '';

			that.setCustomValidity = function( message ) {
				that.validity = validityState( false, false, message );
				// what if there is an underlying error?
				that.validationMessage = message;
			};

		});
	}


	// INPUT validity API not implemented in browser
	if ( typeof input[ 0 ].validity !== 'object' ) {

		// check for blank required fields on submit
		// TODO perform ALL validation (helps pickup autofilled entries that did not trigger change)
		$( 'form' ).bind( 'submit.constraintValidationAPI', function() {

			var form = $( this ),
				novalidate = !! form.attr( 'novalidate' ),
				// TODO this event be created as needed (not shared)
				// method for new InvalidEvent() that returns a new event with stop propagation on by default
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
					if ( ! novalidate ) {
						$this.trigger( invalidEvent );
					}
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
							if ( ! novalidate ) {
								$( this ).trigger( invalidEvent );
							}
						}
					}
				});

			}());

		});

	}


	// suppress submit if invalid fields exist
	// required for Opera 11.5 on OSX
	// TODO need @novalidate tests for this, it should not executive is @novalidate is true
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

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

		// fields that validate
		candidateForValidation = 'input, select, textarea',

		// for feature detection
		input = $( '<input>' ),

		// new 'invalid' event
		invalidEvent = function() {
			var invalid = $.Event( 'invalid' );
			// invalid events do not bubble
			invalid.stopImmediatePropagation();
			return invalid;
		},

		// manage validity state object
		validityState = function( typeMismatch, valueMissing, message ) {
			var customError = false;

			if ( typeof message !== 'undefined' ) {
				customError = !! message;
			}
			return {
				customError: customError,
				typeMismatch: !! typeMismatch,
				valueMissing: !! valueMissing,
				valid: ! typeMismatch && ! valueMissing && ! customError
			};
		},

		validateField = function( message ) {

			var $this = $( this ),
				valueMissing = $this.attr( 'required' ) && ! this.value,
				invalidEmail = this.getAttribute( 'type' ) === 'email' && !! this.value && ! REXP_EMAIL.test( this.value )
			;

			// set .validityState
			this.validity = validityState( invalidEmail, valueMissing, message );
			
			// set .validationMessage
			if ( this.validity.valid ) {
				this.validationMessage = '';

			} else if ( this.validity.customError ) {
				this.validationMessage = message;

			} else if ( this.validity.valueMissing ) {
				this.validationMessage = 'Please answer this question';

			} else if ( this.validity.typeMismatch ) {
				this.validationMessage = 'Please type an email address';
			}

			return this.validity.valid;
		},

		initConstraintValidationAPI = function() {

			// INPUT validityState
			if ( typeof input[ 0 ].validity !== 'object' ) {
				// set us up the API
				$( candidateForValidation ).filter(function() {
					return typeof this.validity !== 'object';
				}).each(function() {

					this.validity = validityState( false, false, '' );
					this.validationMessage = '';

				});
			}

			// INPUT validitationMessage
			if ( typeof input[ 0 ].validationMessage !== 'string' ) {
				// set us up the API
				$( candidateForValidation ).filter(function() {
					return typeof this.validationMessage !== 'string';
				}).each(function() {
					this.validationMessage = '';
				});
			}

			// INPUT checkValidity
			if ( typeof input[ 0 ].checkValidity !== 'function' ) {
				// set us up the API
				$( candidateForValidation ).filter(function() {
					return typeof this.checkValidity !== 'function';
				}).each(function() {
					var domElement = this,
						$this = $( this );

					this.checkValidity = function() {
						// TODO is this breaking .setCustomValidity() by passing NULL as 'message'
						var valid = validateField.call( domElement );

						// if invalid, and unless novalidate
						if ( ! valid && ! $this.closest( 'form' ).attr( 'novalidate' )) {
							// fire invalid event
							$this.trigger( invalidEvent() );
						}

						return valid;
					};
				});
			}

			// INPUT setCustomValidity
			if ( typeof input[ 0 ].setCustomValidity !== 'function' ) {
				// set us up the API
				$( candidateForValidation ).filter(function() {
					return typeof this.setCustomValidity !== 'function';
				}).each(function() {
					var that = this;

					this.validity = validityState( false, false, '' );
					this.validationMessage = '';

					this.setCustomValidity = function( message ) {
						validateField.call( that, message );
					};
				});
			}

		}
	;


	// expose
	window.initConstraintValidationAPI = initConstraintValidationAPI;


	// INPUT validity API not implemented in browser
	if ( typeof input[ 0 ].validity !== 'object' ) {

		// check for blank required fields on submit
		// TODO perform ALL validation (helps pickup autofilled entries that did not trigger change)
		$( 'form' ).bind( 'submit.constraintValidationAPI', function() {

			var form = $( this ),
				novalidate = !! form.attr( 'novalidate' )
			;

			// check fields
			form.find( candidateForValidation ).not( ':radio' ).each(function() {

				validateField( this );

				if ( !this.validity.valid ) {
					// invalid event
					if ( ! novalidate ) {
						$( this ).trigger( invalidEvent() );
					}
				}

			});

			// check required radio button groups
			// TODO roll radio button handling into .checkValidity() and validateField()
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
								$( this ).trigger( invalidEvent() );
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

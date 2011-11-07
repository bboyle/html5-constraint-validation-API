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


		// polyfill test
		polyfill = typeof input[ 0 ].validity !== 'object',


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
				radio = this.type === 'radio',
				valueMissing = $this.attr( 'required' ) && ! this.value,
				invalidEmail = this.getAttribute( 'type' ) === 'email' && !! this.value && ! REXP_EMAIL.test( this.value )
			;

			// radio buttons
			if ( radio ) {
				valueMissing = $( this.form.elements[ this.name ] ).filter( ':checked' ).length === 0;
			}

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

			return this.disabled || this.validity.valid;
		},


		changeHandler = function( event ) {
			validateField.call( event.target );
		},


		submitHandler = function( event ) {

			var form = $( this ),
				novalidate = !! form.attr( 'novalidate' ),
				valid = false
			;

			// polyfill validation?
			if ( polyfill ) {
				// check fields
				form.find( candidateForValidation ).each(function() {

					invalid = ! validateField.call( this );


					// unless @novalidate
					if ( ! novalidate ) {
						// if invalid
						if ( invalid ) {
							// trigger invalid
							$( this ).trigger( invalidEvent() );
						}
					}
				});
			}

			// NOTE the code below runs in all browsers to polyfill implementation bugs
			// e.g. Opera 11 on OSX fires submit event even when fields are invalid
			// correct implementations will not invoke this submit handler until all fields are valid

			// unless @novalidate
			// if there are invalid fields
			if ( ! novalidate && form.find( candidateForValidation ).filter(function() {
				return ! ( this.disabled || this.validity.valid );
			}).length > 0 ) {
				// abort submit
				event.stopImmediatePropagation();
				event.preventDefault();
				return false;
			}
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

				// check validity on change
				$( candidateForValidation )
					.unbind( 'change.constraintValidationAPI' )
					.bind( 'change.constraintValidationAPI', changeHandler )
				;
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

			// check validity on submit
			// this should be bound before all other submit handlers bound to the same form
			// otherwise they will execute before this handler can cancel submit (oninvalid)
			$( 'form' )
				.unbind( 'submit.constraintValidationAPI' )
				.bind( 'submit.constraintValidationAPI', submitHandler )
			;
		}
	;


	// run immediately and ondocumentready
	initConstraintValidationAPI();
	$( initConstraintValidationAPI );


	// expose init function
	window.initConstraintValidationAPI = initConstraintValidationAPI;


}( jQuery ));
}

/*
	forces Constraint Validation API

	helpers for the HTML5 constraint validation API

*/

if ( jQuery !== 'undefined' ) {
(function( $ ){
	'use strict';


	// http://www.whatwg.org/specs/web-apps/current-work/multipage/states-of-the-type-attribute.html#valid-e-mail-address
	// 1*( atext / "." ) "@" ldh-str 1*( "." ldh-str )
	var REXP_EMAIL = /^[A-Za-z0-9!#$%&'*+\-\/=\?\^_`\{\|\}~\.]+@[A-Za-z0-9\-]+(\.[A-Za-z0-9\-]+)*$/,

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
		validityState = function( typeMismatch, valueMissing, customError, message, patternMismatch ) {

			if ( typeof message === 'string' ) {
				customError = !! message;
			}
			return {
				customError: customError,
				typeMismatch: !! typeMismatch,
				patternMismatch: !! patternMismatch,
				valueMissing: !! valueMissing,
				valid: ! valueMissing && ! customError && ! typeMismatch && ! patternMismatch
			};
		},


		validateField = function( message ) {

			var $this = $( this ),
				valueMissing = !! $this.attr( 'required' ),
				invalidEmail = this.getAttribute( 'type' ) === 'email' && !! this.value && ! REXP_EMAIL.test( this.value ),
				patternMismatch,
				pattern
			;

			// if required, check for missing value
			if ( valueMissing ) {

				if ( /^select$/i.test( this.nodeName )) {
					valueMissing = this.selectedIndex === 0 && this.options[ 0 ].value === '';

				// radio buttons
				} else if ( this.type === 'radio' ) {
					valueMissing = $( this.form.elements[ this.name ] ).filter( ':checked' ).length === 0;
				} else {
					valueMissing = ! this.value;
				}

			}

			if ( !! this.getAttribute( 'pattern' ) ) {
				if ( this.value.length > 0 ) {
					// http://www.whatwg.org/specs/web-apps/current-work/multipage/common-input-element-attributes.html#compiled-pattern-regular-expression
					pattern = new RegExp( '^(?:' + this.getAttribute( 'pattern' ) + ')$' );

					patternMismatch = ! pattern.test( this.value );
					
				} else {
					patternMismatch = false;
				}
			}

			// set .validityState
			this.validity = validityState( invalidEmail, valueMissing, this.validity.customError || false, message, patternMismatch );
			
			// set .validationMessage
			if ( this.validity.valid ) {
				this.validationMessage = '';

			} else if ( this.validity.customError ) {
				if ( typeof message === 'string' ) {
					this.validationMessage = message;
				}

			} else if ( this.validity.valueMissing ) {
				this.validationMessage = 'Please answer this question';

			} else if ( this.validity.typeMismatch ) {
				this.validationMessage = 'Please type an email address';

			} else if ( this.validity.patternMismatch ) {
				this.validationMessage = 'Please use the format shown';

			} else {
				this.validationMessage = 'Please answer the question correctly';
			}

			return this.disabled || this.validity.valid;
		},


		changeHandler = function( event ) {
			var target = event.target;

			validateField.call( target );

			if ( target.type === 'radio' ) {
				$( target.form.elements[ this.name ] ).each(function() {
					this.validity = target.validity;
					this.validationMessage = target.validationMessage;
				});
			}
		},


		submitHandler = function( event ) {

			var form = $( this ),
				novalidate = !! form.attr( 'novalidate' ),
				invalid = false
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
			var candidates = $( candidateForValidation );

			// INPUT validityState
			if ( typeof input[ 0 ].validity !== 'object' ) {
				// set us up the API
				candidates.filter(function() {
					return typeof this.validity !== 'object';
				}).each(function() {

					this.validity = validityState( false, false, false, '', false );
					this.validationMessage = '';

				});

				// check validity on change
				candidates
					.unbind( 'change.constraintValidationAPI' )
					.bind( 'change.constraintValidationAPI', changeHandler )
				;
			}

			// INPUT validitationMessage
			if ( typeof input[ 0 ].validationMessage !== 'string' ) {
				// set us up the API
				candidates.filter(function() {
					return typeof this.validationMessage !== 'string';
				}).each(function() {
					this.validationMessage = '';
				});
			}

			// INPUT checkValidity
			if ( typeof input[ 0 ].checkValidity !== 'function' ) {
				// set us up the API
				candidates.filter(function() {
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
				candidates.filter(function() {
					return typeof this.setCustomValidity !== 'function';
				}).each(function() {
					var that = this;

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

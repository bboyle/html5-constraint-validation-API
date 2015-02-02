/*! HTML5 constraintValidationAPI - v1.0.4 - 2015-02-02
* https://github.com/bboyle/html5-constraint-validation-API
* Copyright (c) 2015 Ben Boyle; Licensed MIT */
/*exported initConstraintValidationAPI*/
if ( jQuery !== 'undefined' ) {
	(function( $ ) {
		'use strict';


		// http://www.whatwg.org/specs/web-apps/current-work/multipage/states-of-the-type-attribute.html#valid-e-mail-address
		// 1*( atext / "." ) "@" ldh-str 1*( "." ldh-str )
		var REXP_EMAIL = /^[A-Za-z0-9!#$%&'*+\-\/=\?\^_`\{\|\}~\.]+@[A-Za-z0-9\-]+(\.[A-Za-z0-9\-]+)*$/,

			// fields that validate
			candidateForValidation = 'input, select, textarea',

			// for feature detection
			input = $( '<input>' ).get( 0 ),

			// polyfill test
			polyfill = typeof input.validity !== 'object',


			// invalid fields filter
			isInvalid = function() {
				return ! ( this.disabled || this.validity.valid );
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

					} else if ( this.type === 'radio' ) {
						valueMissing = $( this.form.elements[ this.name ] ).filter( ':checked' ).length === 0;

					} else if ( this.type === 'checkbox' ) {
						valueMissing = ! this.checked;

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
								// use triggerHandler because invalid does not bubble
								$( this ).triggerHandler( 'invalid' );
							}
						}
					});
				}

				// NOTE the code below runs in all browsers to polyfill implementation bugs

				// google earth treats all required radio buttons as invalid
				// if the only thing stopping submission is a required radio button group...
				invalid = form.find( candidateForValidation ).filter( isInvalid );
				if ( invalid.length === invalid.filter( ':radio' ).length && invalid.length === invalid.filter(function() {
					// radio button has been checked, but is flagged as value missing
					return this.validity.valueMissing && $( this.form.elements[ this.name ]).filter( ':checked' ).length > 0;
				}).length ) {
					// let submission continue
					invalid.removeAttr( 'required' );
				}

				// Opera 11 on OSX fires submit event even when fields are invalid
				// correct implementations will not invoke this submit handler until all fields are valid

				// unless @novalidate
				// if there are invalid fields
				if ( ! novalidate && form.find( candidateForValidation ).filter( isInvalid ).length > 0 ) {
					// abort submit
					event.stopImmediatePropagation();
					event.preventDefault();
					return false;
				}
			},


			initConstraintValidationAPI = function() {
				var candidates = $( candidateForValidation );

				// INPUT validityState
				if ( polyfill ) {
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
				if ( typeof input.validationMessage !== 'string' ) {
					// set us up the API
					candidates.filter(function() {
						return typeof this.validationMessage !== 'string';
					}).each(function() {
						this.validationMessage = '';
					});
				}

				// INPUT checkValidity
				if ( typeof input.checkValidity !== 'function' ) {
					// set us up the API
					candidates.filter(function() {
						return typeof this.checkValidity !== 'function';
					}).each(function() {
						var domElement = this;

						this.checkValidity = function() {
							var valid = validateField.call( domElement );

							// if invalid, and unless novalidate
							if ( ! valid && ! this.form.hasAttribute( 'novalidate' )) {
								// use triggerHandler because invalid does not bubble
								$( domElement ).triggerHandler( 'invalid' );
							}

							return valid;
						};
					});
				}

				// INPUT setCustomValidity
				if ( typeof input.setCustomValidity !== 'function' ) {
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

/*! HTML5 constraintValidationAPI - v1.0.8 - 2016-07-19
* https://github.com/bboyle/html5-constraint-validation-API
* Copyright (c) 2016 Ben Boyle; Licensed  */
/*exported initConstraintValidationAPI*/
(function() {
	'use strict';
	if ( jQuery !== 'undefined' ) {
		(function( $ ) {

			// http://www.whatwg.org/specs/web-apps/current-work/multipage/states-of-the-type-attribute.html#valid-e-mail-address
			// 1*( atext / "." ) "@" ldh-str 1*( "." ldh-str )
			var REXP_EMAIL = /^[A-Za-z0-9!#$%&'*+\-\/=\?\^_`\{\|\}~\.]+@[A-Za-z0-9\-]+(\.[A-Za-z0-9\-]+)*$/,

				// fields that validate
				candidateForValidation = 'input, select, textarea',

				// for feature detection
				input = $( '<input>' ).get( 0 ),

				// polyfill test
				polyfill = typeof input.validity !== 'object',

				// radio button bug (google earth internal browser)
				radioButtonBug = ! polyfill && $( '<input type="radio" required checked>' ).get( 0 ).validity.valueMissing === true,
				validateBuggyRadioButtons,

				// invalid fields filter
				isInvalid = function() {
					return ! ( this.disabled || this.validity.valid );
				},

				// get all radio buttons
				getRadioButtonsInGroup = function( radio ) {
					return $( radio.form.elements[ radio.name ] ).filter( '[name="' + radio.name + '"]' );
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

				// @required validation
				validateRequired = function( element, radio ) {
					if ( ! element.getAttribute( 'required' )) {
						return false;
					}

					if ( /^select$/i.test( element.nodeName )) {
						return element.selectedIndex === 0 && element.options[ 0 ].value === '';
					}

					if ( radio ) {
						return radio.filter( ':checked' ).length === 0;
					}

					if ( element.type === 'checkbox' ) {
						return ! element.checked;
					}

					return ! element.value;
				},

				// @pattern validation
				validatePattern = function( element ) {
					var pattern;
					if ( !! element.getAttribute( 'pattern' ) ) {
						if ( element.value.length > 0 ) {
							// http://www.whatwg.org/specs/web-apps/current-work/multipage/common-input-element-attributes.html#compiled-pattern-regular-expression
							pattern = new RegExp( '^(?:' + element.getAttribute( 'pattern' ) + ')$' );

							return ! pattern.test( element.value );
						}

						return false;
					}
				},


				validateField = function( message ) {

					var $this = $( this ),
						required = !! $this.attr( 'required' ),
						radio = this.type === 'radio' && getRadioButtonsInGroup( this ),
						valueMissing,
						invalidEmail = this.getAttribute( 'type' ) === 'email' && !! this.value && ! REXP_EMAIL.test( this.value ),
						patternMismatch,
						newValidityState
					;

					// radio buttons are required if any single radio button is flagged as required
					if ( radio && ! required ) {
						required = radio.filter( '[required]' ).length > 0;
					}
					// check for missing value
					valueMissing = validateRequired( this, radio );

					// check @pattern
					patternMismatch = validatePattern( this );

					// set .validityState
					newValidityState = validityState( invalidEmail, valueMissing, this.validity.customError || false, message, patternMismatch );
					if ( radio ) {
						getRadioButtonsInGroup( this ).each(function() { this.validity = newValidityState; });
					} else {
						this.validity = newValidityState;
					}

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
						getRadioButtonsInGroup( target ).each(function() {
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

					// NOTE all the code below runs in all browsers to polyfill implementation bugs

					// required radio button check
					if ( radioButtonBug ) {
						validateBuggyRadioButtons( this );
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
								if ( ! valid && ! this.form.getAttribute( 'novalidate' )) {
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

					// check for required radio button bug (google earth internal browser)
					if ( radioButtonBug ) {
			 			validateBuggyRadioButtons = function( form ) {
							var seen = {};
							var radio, valueMissing;

							// check every required radio button
							$( 'input', form ).filter( ':radio' ).filter( '[required],[aria-required="true"]' ).each(function() {
								if ( typeof seen[ this.name ] === 'undefined' ) {
									seen[ this.name ] = true;

									radio = getRadioButtonsInGroup( this );
									valueMissing = radio.filter( ':checked' ).length === 0;

									if ( valueMissing ) {
										// make sure @required is set to use validation API
										radio.attr( 'required', 'required' );
									} else {
										// using @aria-required=true so we can track this control
										// removing @required here to bypass validation bug
										radio.attr( 'aria-required', true ).removeAttr( 'required' );
									}
								}
							});
						};

						// initial validity
						$( 'form' ).each( validateBuggyRadioButtons );

						// watch changes
						if ( ! polyfill ) {
							candidates.filter( ':radio' )
								.unbind( 'change.constraintValidationAPI' )
								.bind( 'change.constraintValidationAPI', function() {
									validateBuggyRadioButtons( this.form );
								})
							;
						}
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
}());

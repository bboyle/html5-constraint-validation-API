/*
	forces Constraint Validation API

	helpers for the HTML5 constraint validation API

*/

if ( jQuery !== "undefined" ) {
(function( $ ){
	"use strict";

	// where one radio button is required, ensure all are required
	// this ensures each one in the group reports the same .validity.valueMissing properties
	(function() {
		var names = {};

		$( ":radio[required]" ).each(function() {

			if ( names[ this.name ] !== true ) {
				$( ":radio[name=" + this.name + "]" ).attr( "required", "required" );
				names[ this.name ] = true;
			}

		});
	}());


	// INPUT validity API not implemented in browser
	if ( typeof $( "<input>" )[0].validity !== "object" ) {

		// http://www.whatwg.org/specs/web-apps/current-work/multipage/states-of-the-type-attribute.html#valid-e-mail-address
		// 1*( atext / "." ) "@" ldh-str 1*( "." ldh-str )
		var REXP_EMAIL = /^[A-Za-z0-9!#$%&'*+\-\/=\?\^_`\{\|\}~\.]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+$/;


		// check for blank required fields on submit
		$( "form" ).live( "submit", function() {

			var form = $( this );

			// check required fields
			form.find( ":text, select, textarea" ).each(function() {

				var isBlank = this.required && ! this.value,

					invalidEmail = this.getAttribute( "type" ) === "email" && !! this.value && ! REXP_EMAIL.test( this.value )
				;

				this.validity = {
					typeMismatch : invalidEmail,
					valueMissing : isBlank,
					valid : ! isBlank && ! invalidEmail
				};

				$( "body" ).append(
				);
			});

			// check required radio button groups
			(function() {
				
				var names = {};

				form.find( ":radio[required]" ).each(function() {

					if ( names[ this.name ] !== true ) {
						
						var group = form.find( ":radio[name=" + this.name + "]" ),
							isBlank = group.filter( ":checked" ).length === 0;

						group.each(function() {
							this.validity = {
								valueMissing: isBlank,
								valid: ! isBlank
							};
						});

						names[ this.name ] = true;
					}
				});

			}());

		});

	}


}( jQuery ));
}

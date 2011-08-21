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

		// check for blank required fields on submit
		$( "form" ).live( "submit", function() {

			var form = $( this );

			// check required fields
			form.find( ":text[required],select[required],textarea[required]" ).each(function() {
				var isBlank = ! this.value;
				this.validity = {
					valueMissing: isBlank,
					valid: ! isBlank
				};
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

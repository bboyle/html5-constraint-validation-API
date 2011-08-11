/*
	forces Constraint Validation API

	implements the HTML5 constraint validation API
	2011-08-10: @required

*/

if ( jQuery !== "undefined" ) {
(function( $ ){

	// validity API not implemented in browser
	if ( !( "validity" in $( "<input>" )[0] )) {

		// check for blank required fields on submit
		$( "form" ).live( "submit", function() {

			var form = $( this );

			// check required fields
			form.find( "input[required],select[required]" ).each(function() {
				var isBlank = ! this.value;
				this.validity = {
					valueMissing: isBlank,
					valid: ! isBlank
				};
			});

		});

	}


})( jQuery );
}

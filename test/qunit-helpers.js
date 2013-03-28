/*globals initConstraintValidationAPI*/
/*exported lifecycleCVAPI*/
var lifecycleCVAPI = (function( initConstraintValidationAPI ) {
	return {
		setup: function() {
			initConstraintValidationAPI();
		},
		teardown: function() {
			initConstraintValidationAPI();
		}
	};
}( initConstraintValidationAPI ));

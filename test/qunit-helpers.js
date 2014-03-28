/*global initConstraintValidationAPI*/
lifecycleCVAPI = (function( initConstraintValidationAPI ) {
	return {
		setup: function() {
			initConstraintValidationAPI();
		},
		teardown: function() {
			initConstraintValidationAPI();
		}
	};
}( initConstraintValidationAPI ));

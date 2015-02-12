/*global initConstraintValidationAPI*/
lifecycleCVAPI = {
	beforeEach: function() {
		initConstraintValidationAPI();
	},
	afterEach: function() {}
};


// getting Qunit results to show in saucelabs
// https://github.com/axemclion/grunt-saucelabs#test-result-details-with-qunit
var log = [];

QUnit.done(function( test_results ) {
	var tests = [];
	for ( var i = 0, len = log.length; i < len; i++ ) {
		var details = log[ i ];
		tests.push({
			name: details.name,
			result: details.result,
			expected: details.expected,
			actual: details.actual,
			source: details.source
		});
	}
	test_results.tests = tests;

	window.global_test_results = test_results;
});

QUnit.testStart(function( testDetails ) {
	QUnit.log(function( details ) {
		if ( ! details.result ) {
			details.name = testDetails.name;
			log.push( details );
		}
	});
});
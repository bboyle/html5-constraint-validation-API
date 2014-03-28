[![Travis build status](https://travis-ci.org/bboyle/html5-constraint-validation-API.png?branch=master)](https://travis-ci.org/bboyle/html5-constraint-validation-API)

* handle `@required` on `:text`, `textarea`, `select` and `:radio` controls
* fire `invalid` events
* support `form@novalidate`
* support `@type=email` and `validityState.typeMismatch`
* TODO `@multiple` for email
* TODO `@type=url`
* support `.setCustomValidity( message )`
* support `@pattern` and `validityState.patternMismatch`

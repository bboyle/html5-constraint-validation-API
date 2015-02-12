[![Build Status](https://travis-ci.org/bboyle/html5-constraint-validation-API.svg?branch=master)](https://travis-ci.org/bboyle/html5-constraint-validation-API)
[![devDependencies](https://david-dm.org/bboyle/html5-constraint-validation-API/dev-status.svg)](https://david-dm.org/bboyle/html5-constraint-validation-API#info=devDependencies)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/benboyle-h5cvapi.svg)](https://saucelabs.com/u/benboyle-h5cvapi)

A partial polyfill for the HTML5 constraint validation API (form validation). Requires jQuery. Intended for use with jquery form validation UI scripts.

## Features implemented

* handle `@required` on `:text`, `textarea`, `select` and `:radio` controls
* fire `invalid` events
* support `form@novalidate`
* support `@type=email` and `validityState.typeMismatch`
* support `.setCustomValidity( message )`
* support `@pattern` and `validityState.patternMismatch`

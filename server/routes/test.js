'use strict';

// User routes use test controller
var test = require('../controllers/test');

module.exports = function(app, passport) {

    app.get('/test', test.test);


};

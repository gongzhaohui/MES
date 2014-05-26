'use strict';

var test = require('../controllers/test');


module.exports = function(Mes, app, auth) {

    app.route('/mes/test')
        .get(test.testPromise);
    app.route('/mes/test1')
        .get(test.testRecursive);
};

'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Counter = mongoose.model('Counter'),
    User = mongoose.model('Employee'),
    _ = require('lodash');

/**
 * exports
 *
 */

exports.test = function (req, res) {

    Counter.getNewId('S', 1, function (err, newId) {
        res.jsonp({id: newId});
    });
};
/* todo
 */
exports.create = function (req, res) {
};
/* todo

 */
exports.all = function (req, res) {
};
/* todo

 */
exports..update = function (req, res) {
};
/* todo

 */
exports..remove = function (req, res) {
};

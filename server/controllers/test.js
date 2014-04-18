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
 */
exports={
    test:function(req, res) {
        res.jsonp(Counter.getNewId('S',1));
    },
    /* todo
     */
    create: function (req, res) {
    },
    /* todo

     */
    all: function (req, res) {
    },
    /* todo

     */
    update: function (req, res) {
    },
    /* todo

     */
    remove: function (req, res) {
    }
};
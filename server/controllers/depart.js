'use strict';

/**
 * Module dependencies.
 *
 */
var mongoose = require('mongoose'),
    Depart = mongoose.model('Depart'),
    _ = require('lodash');


/**
 * Find depart by id
 */
exports.depart = function (req, res, next, id) {
    Depart.load(id, function (err, depart) {
        if (err) return next(err);
        if (!depart) return next(new Error('Failed to load depart ' + id));
        req.depart = depart;
        next();
    });
};

/**
 * Create an depart
 */
exports.create = function (req, res) {
    var depart = new Depart(req.body);
    depart.user = req.user;

    depart.save(function (err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                depart: depart
            });
        } else {
            res.jsonp(depart);
        }
    });
};

/**
 * Update an depart
 */
exports.update = function (req, res) {
    var depart = req.depart;

    depart = _.extend(depart, req.body);
    var update = {date: Date.now(), eId: req.user._id};
    depart.updated.$push(update);
    depart.save(function (err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                depart: depart
            });
        } else {
            res.jsonp(depart);
        }
    });
};

/**
 * Delete an depart
 */
exports.destroy = function (req, res) {
    var depart = req.depart;

    depart.remove(function (err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                depart: depart
            });
        } else {
            res.jsonp(depart);
        }
    });
};

/**
 * Show an depart
 */
exports.show = function (req, res) {
    res.jsonp(req.depart);
};

/**
 * List of Departs
 */
exports.all = function (req, res) {
    Depart.find().sort('-created').exec(function (err, departs) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(departs);
        }
    });
};

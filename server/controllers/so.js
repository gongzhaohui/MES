'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    SO = mongoose.model('SO'),
    Status = mongoose.model('Status'),
    Inventory = require('./inventory'),
    _ = require('lodash');

/**
 * exports
 */
exports = {
    /*
     todo
     */
    so: function (req, res, next, id) {
        SO.load(id, function (err, so) {
            if (err) return next(err);
            if (!so) return next(new Error('Failed to load article ' + id));
            req.so = so;
            next();
        });
    },
    /*
     * todo
     * change SO status
     * reserve inventory
     * */
    create: function () {
        var counter = mongoose.model('Counter');
        counter.getNewId('S', 1, function (err, newId) {
            var so = new SO(req.body);
            if (err) {
                return res.send('so/create', {
                    errors: err.errors,
                    so: so
                })
            }
            else {

                so._id = newId;
                so.created = {
                    date: Date.now,
                    eid: req.user
                };
                so.save(function (err) {
                    if (err) {
                        return res.send('so/create', {
                            errors: err.errors,
                            so: so
                        });
                    } else {
                        res.jsonp(so);
                        /*todo
                        * reserve inventory
                        * */
                    }
                });
            }
        });
    },
    /*
     * todo
     * list all populate employee,inventory
     * filter by eId or all
     * order by created
     * */
    all: function () {
    },
    /*
     * todo
     * consider auth,updatable fields
     * history
     * */
    update: function () {
    },
    /*
     * todo
     * change voucher status
     * history
     * */
    changeStatus: function () {
    },
    /*
     * todo
     * consider remove constraint,later process
     * */
    remove: function () {
    }
};
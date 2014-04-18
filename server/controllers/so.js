'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    SO= mongoose.model('SO'),
    Status = mongoose.model('Status'),
    Inventory=require('./inventory'),
     _ = require('lodash');

/**
 * exports
 */
exports = {
    /*
    todo
     */
    so:function(req, res, next, id){

    },
    /*
    * todo
    * change SO status
    * reserve inventory
    * */
    create: function () {
        var counter = mongoose.model('Counter');
        counter.getNextSequence('S', 1, function (err, result) {
            if (!err) {
                var seqStr = '000000000' + result.seq;
                seqStr = seqStr.slice(seqStr.length - 9);
                var so = new SO({
                    _id: 'S' + seqStr,
                    soDate: Date(),
                    deuDate: Date(),
                    items: [
                        {
                            rowNo: 1,
                            quantity: 5
                        }
                    ]
                });
                //req.body);
//    so.aId = req.user;

                so.save(function (err) {
                    if (err) {
                        return res.send('user/signup', {
                            errors: err.errors,
                            so: so
                        });
                    } else {
                        res.jsonp(so);
                    }
                });
            }
            else res.jsonp(err);
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
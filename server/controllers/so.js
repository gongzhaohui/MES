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
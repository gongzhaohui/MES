'use strict';

/**
 * Module dependencies.
 * controller po,outbound
 */
var mongoose = require('mongoose'),
    MO= mongoose.model('MO'),
    Status = mongoose.model('Status'),
    PO=require('./po'),
    Process= mongoose.model('Process'),
    Outbound=require('./outbound'),
    _ = require('lodash');

/**
 * exports
 */
exports = {
    /*
    * todo
    *
    * */
    po:function(req, res, next, id){

    },

    /*
    * todo
    * change SO status
     * create po(purchasing items),outbound(stocked items),task(manufacturing items)
     * reserve station time
    */
    create: function (req,res) {
        var mo=new MO(req.body);
        mo.created.date=Date.now;
        mo.created.eId=req.user._id;
        mo.items.each(function(item){
        {
            var way=  item.way;
            Process.load();
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
     * update progress
     * history
     * */
    stationInput: function () {
    },
    /*
     * todo
     * consider remove constraint,later process
     * */
    remove: function () {
    }
};
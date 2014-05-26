'use strict';
/**
 * exports
 *
 */
exports.testRecursive = function (req, res) {

    var assert = require('assert');
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;
    var dbname = 'testing_populateAdInfinitum';

    var db = mongoose.connection;
    var db2 = db.useDb(dbname);

    var user = new Schema({
        name: String, children: [
            { seq: Number, child: {type: Schema.ObjectId, ref: 'User'}, qty: Number}
        ]
    });
    var User = db2.model('User', user);

    var BOM = [];
    var root = 'p0';
// keep track of recursion count
    var count = 0;
// to be called when recursion is completed
    function out(obj) {
        BOM.push(obj);
    }

    function last() {
        res.jsonp(BOM);
    }

// call 'last' when count is 0
    var done = function () {
        if (count === 0) last();
    };
// the recursive function
    function recurse(parent, lvl, qty, seq) {
        count++;
        //           out({lvl:lvl,user:parent});
        //console.log(parent);
        User.findOne({ name: parent}).lean().populate({path: 'children.child', select: 'name'}).exec(function (err, user) {
            if (user) {
                seq = lvl === 0 ? '1' : seq;
                out({lvl: lvl, user: user.name, seq: seq, qty: qty});
                lvl++;
                if (user.children.length > 0) {
                    for (var i = 0; i < user.children.length; i++) {
                        recurse(user.children[i].child.name, lvl, qty * user.children[i].qty, seq + '.' + user.children[i].seq);
                    }
                }
                lvl--;
            }
            count--;
            done();
        });
    }

// kick off the recursion
    function run() {
        recurse(root, 0, 2, 1);
    }

// and begin
    run();


};


/* todo
 */

exports.testPromise = function (req, res) {
var bomSpreader=require('./bomspreader.js').bomSpreader;
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;
    var dbname = 'testing_populateAdInfinitum';

    var db = mongoose.connection;
    var db2 = db.useDb(dbname);

    var user = new Schema({
        name: String, children: [
            { seq: Number, child: {type: Schema.ObjectId, ref: 'User'}, qty: Number}
        ]
    });
    var User = db2.model('User', user);
    //console.log(bomSpreader);
    bomSpreader({invCode:'p0',quantity:2},{model:User,searchField:'name',serialField:'seq',quantityField:'qty'}).then(function(bom){
        res.jsonp(bom);
    });

};


exports.create = function (req, res) {
};
/* todo

 */
exports.all = function (req, res) {
};
/* todo

 */
exports.update = function (req, res) {
};
/* todo

 */
exports.remove = function (req, res) {
};

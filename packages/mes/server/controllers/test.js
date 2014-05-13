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
        //          console.log(User);

        /*        User.remove( function(err) {
         console.log('collection removed');
         });*/
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
            console.log('finded', user);
            if (user) {
                seq = lvl === 0 ? '1' : seq;
                out({lvl: lvl, user: user.name, seq: seq, qty: qty});
//                    console.log(user, user.children.length);
                lvl++;
                if (user.children.length > 0) {
                    for (var i = 0; i < user.children.length; i++) {

                        recurse(user.children[i].child.name, lvl, qty * user.children[i].qty, seq + '.' + user.children[i].seq);
                    }
                }
                lvl--;
            }
            count--;
            console.log('lvl', lvl);
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
    var promise = function (parent) {
        return  User.findOne({ name: parent}).lean().populate({path: 'children.child', select: 'name'}).exec
    };
    var addBom = function (inv, result) {
        var lvl=0;
        var seq=0
        var qty=1;
        var name=inv.name;
    };
    var isAssembly = function (inv) {
        return inv.children.length > 0;
    };
    var getInv = promise(parent).then(function (inv) {
        return inv
    }, function (err) {
    });
    var bind = function (f, g) {
        return g(f)
    };
    var recursive = function (getdir) {
        if(f.next){
           recursive(f.next)
       }

    }
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

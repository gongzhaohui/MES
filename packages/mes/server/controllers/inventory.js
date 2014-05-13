'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Inventory = mongoose.model('Inventory'),
    User = mongoose.model('Employee'),
    _ = require('lodash');

/**
 * exports
 */
exports = {
    inventory: function (req, res, next, id) {

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
    },
    /* todo

     */
    getBOM: function (inv, req, res) {
        var BOM = [];
        var root = inv;
// keep track of recursion count
        var count = 0;
// to be called when recursion is completed
        function out(obj) {
            BOM.push(obj);
        }

        function last() {
            res.jsonp(BOM);
            //          console.log(User);

            User.remove(function (err) {
                console.log('collection removed');
            });
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


    }
};
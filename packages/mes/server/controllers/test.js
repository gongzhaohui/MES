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
    var assert = require('assert');
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;
    var dbname = 'testing_populateAdInfinitum';
    var Q=require('q');

    var db = mongoose.connection;
    var db2 = db.useDb(dbname);

    var user = new Schema({
        name: String, children: [
            { seq: Number, child: {type: Schema.ObjectId, ref: 'User'}, qty: Number}
        ]
    });
    var User = db2.model('User', user);

    /*
    var addBom = function (inv, result) {
        var lvl=0;
        var seq=0;
        var qty=1;
        var name=inv.name;
    };

    var MONAD=function (modifier) {
        'use strict';
        var prototype = Object.create(null);
        prototype.is_monad = true;
        function unit(value) {
            var monad = Object.create(prototype);
            monad.bind = function (func, args) {
                return func.apply(
                    undefined,
                    [value].concat(Array.prototype.slice.apply(args || []))
                );
            };
            if (typeof modifier === 'function') {
                modifier(monad, value);
            }
            return monad;
        }
        unit.method = function (name, func) {
            prototype[name] = func;
            return unit;
        };
        unit.lift_value = function (name, func) {
            prototype[name] = function () {
                return this.bind(func, arguments);
            };
            return unit;
        };
        unit.lift = function (name, func) {
            prototype[name] = function () {
                var result = this.bind(func, arguments);
                return result && result.is_monad === true ? result : unit(result);
            };
            return unit;
        };
        return unit;
    };
    var monad = MONAD();
    monad(prompt("Enter your name:")).bind(function (name) {
        alert('Hello ' + name + '!');
    });
    var isAssembly = function (inv) {
        return inv.children.length > 0;
    };
    var promise = function (parent) {
        return  User.findOne({ name: parent}).lean().populate({path: 'children.child', select: 'name'}).exec
    };*/

/*
    var unit = function(x) {
        return new Promise(x);
    };

// bind :: Promise a -> (a -> Promise b) -> Promise b
    var bind = function(input, f) {
        var output = new Promise();
        input.then(function(x) {
            f(x).then(function(y) {
                output.resolve(y);
            });
        });
        return output;
    };
    var pipe = function(x, functions) {
        for (var i = 0, n = functions.length; i < n; i++) {
            x = bind(x, functions[i]);
        }
        return x;
    };
    var getInv = function(parent){
        var promise = new Q.Promise();
        User.findOne({ name: parent}).lean().populate({path: 'children.child', select: 'name'}).then(function (inv) {
            promise.resolve( inv);
        });
        return promise;
    };
    var BOM=[];
    var putBom=function(inv){
        var promise = new Q.Promise();
        BOM=BOM.concat(inv);
        return promise(BOM);
    };

    var recursive = function (bom,parent) {
        var inv=getInv(parent);
        bom=bom.concat(inv);
        if(inv.children.length){
            inv.children.forEach(function(child){
                 recursive(bom,child);
            });

       }
    };
*/
    function getFromRedis(parent){
        return User.findOne({ name: parent}).lean().populate({path: 'children.child', select: 'name'}).then(function (inv) {
            // this is our returned object
            var constructedObject = {label: inv.name};

            if (inv.children.length) {
                var dependents = inv.children.map(function(par) {
                    // get a promise for the next level
                    return getFromRedis(par.name);
                });
                return Q.all(dependents).then(function(dependentResults) {
                    constructedObject.parents = dependentResults;
                    return constructedObject;
                });
            } else {
                return constructedObject; // without parents
            }
        });
    }

    getFromRedis( 'p0' ).done(function(out) {
        res.jsonp( JSON.stringify( out ));
    });
   // res.jsonp(recursive([],'p0'));
    //res.json("aaa")
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

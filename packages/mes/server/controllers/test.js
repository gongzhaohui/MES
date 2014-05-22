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

    var getusr= Q.nbind(User.findOne,User);
    var popusr= Q.nbind(User.populate,User);
    getusr({ 'name': 'p0'}).then(function(usr){
        console.log(usr);
        popusr(usr,{path: 'children.child', select: 'name'}).then(function(usr){
            res.jsonp(usr);
        })
    });
    /*function spread(parent){
        var promise=User.findOne({ 'name': parent}).lean().populate({path: 'children.child', select: 'name'}).exec();
        return promise.then(function (inv) {
            // this is our returned object
            var constructedObject = {label: inv.name};

            if (inv.children.length) {
                var dependents = inv.children.map(function(par) {
                    // get a promise for the next level
                    return spread(par.name);
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

    spread( 'p0' ).then(function(out) {
        res.jsonp( JSON.stringify( out ));
    });
   // res.jsonp(recursive([],'p0'));
    //res.json("aaa")*/
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

/*-----------------------------------------------------------------
 var _ = require('lodash');
 var q = require('q');
 var fs = require('fs');
 var path = require('path');
 var chalk = require('chalk');

 var defaultConfig = {
 callback: null,
 maxDepth: Infinity,
 maxIterations: 500,
 directoryMode: false
 };

 /**
 * Main module function. Performs all async walking
 * @param  {string} dir               - Path to walk
 * @param  {object|function} [config] - Optional config object or callback
 * @param  {boolean} [directoryMode]  - Optional param to indicate directory instead of file mode
 * @return {object}                   - Q.promise that resolves to results array.
 */
function asyncWalker(dir, config, directoryMode) {
    dir = path.normalize(dir); // Normalize so depth doesn't fail
    // Setup and normalize configuration
    var defaults = _.clone(defaultConfig);

    if (config) {
        if (_.isFunction(config)) {
            defaults.callback = config;
            config = defaults;

            if (arguments.length > 2) config.directoryMode = directoryMode;
        } else {
            config = _.defaults(config, defaults);
        }
    } else {
        config = defaults;
    }

    var originalDepth = getDepth(dir);
    var hasMaxDepth = _.isFinite(config.maxDepth);
    var iterations = 0;
    var hasMaxIterations = _.isFinite(config.maxIterations);
    var hasRecursionLimits = hasMaxDepth || hasMaxDepth;

    /**
     * Get current path depth
     * @param  {string} dir - Directory path
     * @return {number}     - Current depth
     */
    function getDepth(dir) {
        return dir.split(path.sep).length;
    }

    function getDepthFromBase(dir) {
        return getDepth(dir) - originalDepth;
    }

    /**
     * Main asyncEntry
     * @param  {string} dir - Qualified directory to search
     * @return {object}     - Promise
     */
    function walkAsync(dir) {
        var skip = false;
        var deferred = q.defer();

        if (hasRecursionLimits) {
            var currentDepth = getDepthFromBase(dir);
            if (hasMaxDepth && currentDepth >= config.maxDepth) {
                console.warn(chalk.yellow("Reached max depth (%d) in: " + dir), config.maxDepth);
                skip = true;
            }

            if (hasMaxIterations) {
                if (iterations >= config.maxIterations) skip = true;
                iterations++;
            }
        }

        if (skip) {
            deferred.resolve(void 0);
        } else {
            readdir(dir)
                .then(statItems)
                .then(getFiles)
                .then(function(a) {
                    deferred.resolve(a);
                }, function(b) {
                    deferred.reject("Error " + b);
                });
        }

        return deferred.promise;
    }

    /**
     * Async readdir that makes sure iterations doesn't get out of hand
     * maps directory contents to the qualified base, and returns
     * a promise intead of using callback style
     * @param  {string} dir - Directory to read
     * @return {object}     - fs.readdir wrapped in a promise
     */
    function readdir(dir) {
        return q
            .nfapply(fs.readdir, [dir])
            .then(function(list) {
                return mapPaths(dir, list);
            });
    }

    /**
     * Gets the fs.stat object from each item in the list and
     * sends back an object w/ the relevant values set
     * @param  {Array.<string>} list - List of paths to get fs.stat info for
     * @return {object}     - Promise that resolves to the array of normalized
     * objects when all fs.stat promises resolve
     */
    function statItems(list) {
        var statPromises = [];

        _.forEach(list, function(item) {
            var qStatPromise = q.nfapply(fs.stat, [item]).then(function(stat) {
                var itemStat = {
                    path: item,
                    isFile: stat.isFile(),
                    isDirectory: stat.isDirectory()
                };

                if (config.callback) {
                    itemStat = config.callback(itemStat);
                    // For filter
                    if (!itemStat) return;
                }

                return itemStat;
            }, function(err) {
                if (err) console.warn(chalk.yellow(err.message));
            });

            statPromises.push(qStatPromise);
        });

        return q.all(statPromises);
    }

    /**
     * Takes in a stat list and collects the files, while creating new
     * promises on any directories. When all promises resolve down the chain
     * this eventually has the list of all files.
     * @param  {array} list - List of stat objects
     * @return {object}     - q.all promise that resolves w/ the full
     * list of files when all promises have been resolved
     */
    function getFiles(list) {
        var files = [];
        var promises = [];

        _.forEach(list, function(item) {
            if (!item) return;

            if (config.directoryMode) {
                if (item.isDirectory) {
                    files.push(item.path);
                    promises.push(walkAsync(item.path));
                }
                return;
            }

            if (item.isDirectory) {
                promises.push(walkAsync(item.path));
            } else if (item.isFile) {
                files.push(item.path);
            }
        });

        return q.all(promises).then(function(list) {
            return _.flatten(files.concat(_.compact(list)));
        });
    }

    /**
     * Simply takes a list of items and joins the provided base to each item.
     * @param  {string} base - The base path to use
     * @param  {array} list - List of items to use
     * @return {array}      - Mapped list of items
     */
    function mapPaths(base, list) {
        return _.map(list, function(item) {
            return path.join(base, item);
        });
    }

    return walkAsync(dir);
}

(function(aw) {
    function _createFilterFn(callback, matchDirectories) {
        return function(itemStat) {
            var toAdd = (itemStat.isDirectory && !matchDirectories) ? true : !!callback(itemStat.path);
            return toAdd ? itemStat : void 0;
        };
    }

    function _createMapFn(callback) {
        return function(itemStat) {
            if (itemStat.isDirectory) return itemStat;
            itemStat.path = callback(itemStat.path);
            return itemStat;
        };
    }

    aw.filter = function(dir, callback, matchDirectories) {
        var filterFn = _createFilterFn(callback, matchDirectories);
        return aw(dir, filterFn);
    };

    aw.map = function(dir, callback) {
        var mapFn = _createMapFn(callback);
        return aw(dir, mapFn);
    };
}(asyncWalker));

module.exports = asyncWalker;
/*----------------------------------------------------- */

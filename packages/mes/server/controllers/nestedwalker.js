/**
 * BOM spreader
 *
 * referred Async Walker By bfricka
 * 2014-5-22
 * Gong
 *
 *
 */
var _ = require('lodash');
var q = require('q');
var fs = require('fs');
var path = require('path');
var chalk = require('chalk');

var defaultConfig = {

    callback: null,
    maxDepth: 1000,
    maxIterations: 500,
    assemblyMode: false
};

var pathsep='.';

/**
 * Main module function. Performs all async walking
 * @param  {string} model               - model to walk
 *          schema like this:
 *              Schema({
                    name: String,
                    children: [
                        { seq: Number, child: {type: Schema.ObjectId, ref: 'self'}, qty: Number}
        ]
    })
 * @param  {string} base               - {field,value,serial,quantity}
 * @param  {object|function} [config] - Optional config object or callback
 * @param  {boolean} [assemblyMode]  - Optional param to indicate directory instead of file mode
 * @return {object}                   - Q.promise that resolves to results array.
 */
function bomSpreader(model,base, config, assemblyMode) {
    var defaults = _.clone(defaultConfig);
    var getInventory= q.nbind(model.findOne,model);
    var popChildren= q.nbind(model.populate,model);

    if (config) {
        if (_.isFunction(config)) {
            defaults.callback = config;
            config = defaults;

            if (arguments.length > 2) config.assemblyMode = assemblyMode;
        } else {
            config = _.defaults(config, defaults);
        }
    } else {
        config = defaults;
    }

    var originalDepth = 0;
    var hasMaxDepth = _.isFinite(config.maxDepth);
    var iterations = 0;
    var hasMaxIterations = _.isFinite(config.maxIterations);
    var hasRecursionLimits = hasMaxDepth || hasMaxDepth;

    /**
     * Get current path depth
     * @param  {string} path - BOM path
     * @return {number}     - Current depth
     */
    function getDepth(path) {
        return path.split(pathsep).length;
    }

    function getDepthFromBase(path) {
        return getDepth(path) - originalDepth;
    }

    /**
     * Main asyncEntry
     * @param  {string} fieldValue - Qualified value to search
     * @return {object}     - Promise
     */
    function walkAsync(base) {
        var skip = false;
        var deferred = q.defer();

        path=base.serial||'';
        if (hasRecursionLimits) {
            var currentDepth = getDepthFromBase(path);
            if (hasMaxDepth && currentDepth >= config.maxDepth) {
                console.warn(chalk.yellow("Reached max depth (%d) in: " + path+':'+base.name), config.maxDepth);
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
            readDoc(base)
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
     * Async readDoc that makes sure iterations doesn't get out of hand
     * maps directory contents to the qualified base, and returns
     * a promise intead of using callback style
     * @param  {object} base - Qualified value to search
     * @return {object}     - readDoc wrapped in a promise
     */
    function readDoc(base) {
        var condition={};
        condition[base.field]=base.value;
        return getInventory(condition)
            .then(function(inv) {
                popChildren(inv, {path: 'children.child', select: 'name'}).then(function (inv) {
                    return mapPaths(base, inv);
                });
            })
    }

    /**
     * Gets the fs.stat object from each item in the list and
     * sends back an object w/ the relevant values set
     * @param  {Array.<object>} list - List of paths to get fs.stat info for
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

            if (config.assemblyMode) {
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
            var paths = Array.prototype.filter.call(arguments, f);
            var joined = paths.join('\\');
            return path.join(base, item);
        });
    }

    return walkAsync(base);
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
}(bomSpreader));

module.exports = bomSpreader;
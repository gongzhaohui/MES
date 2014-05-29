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
//var chalk = require('chalk');

var defaultConfig = {
    searchField: '_id',
    quantityField: 'quantity',
    serialField: 'serial',
    popFields: '',
    callback: null,
    maxDepth: 1000,
    maxIterations: 1000
};

var pathsep = '.';

/**
 * Main module function. Performs all async walking


 * @param  {object} base               - {inv:fieldValue,serial:'1',qty:1-n}
 * @param  {object} config -  config object
 *  *  config.model               - model to walk
 *         schema like this:
 *              Schema({
                    name: String,
                    children: [
                        { seq: Number, child: {type: Schema.ObjectId, ref: self}, qty: Number}
        ]
    })
 * @return {object}                   - Q.promise that resolves to results array.
 */
exports.bomSpreader = function (base, config) {
    var defaults = _.clone(defaultConfig);
    //console.log(base);
    //console.log(config);
    if (!base || !base.invCode) {
       console.log(base);
        throw new Error('base object is required')
    }
    base.quantity= base.quantity||1;
    base.quantity=base.quantity>0?base.quantity:1;
    if (!config || !config.model) {
        //console.warn("model must be configured.");
        throw new Error('model is required in config')
    } else {
        config = _.defaults(config, defaults);
    }
    if (config.popFields.indexOf(config.searchField) <= 0) {
        config.popFields = config.popFields + ' ' + config.searchField;
        config.popFields = config.popFields.replace(/(^\s*)/g, "")
    }
    //console.log(config.popFields);
    var model = config.model;
    var getInventory = q.nbind(model.findOne, model);
    var popChildren = q.nbind(model.populate, model);

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
     * @param  {object} base               - {invCode,serial,qty,popFields}
     *  @return {object}     - Promise
     */
    function spreadBom(base) {
        var skip = false;
        var deferred = q.defer();
        var path = base.path= base.path||base.invCode ;
        base.serial=base.serial||'';
        if (hasRecursionLimits) {
            var currentDepth = getDepthFromBase(path);
            if (hasMaxDepth && currentDepth >= config.maxDepth) {
                console.warn("Reached max depth (%d) in: " + path + ':' + base.invCode, config.maxDepth);
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
                .then(getChildren)
                .then(function (a) {
                    deferred.resolve(a);
                }, function (b) {
                    deferred.reject("Error " + b);
                });
        }

        return deferred.promise;
    }

    /**
     * @param  {object} base - Qualified value to search
     * @return {object}     - readDoc wrapped in a promise
     */
    function readDoc(base) {
        var condition = {};
        condition[config.searchField] = base.invCode;
        return getInventory(condition)
            .then(function (inv) {
                var options = {path: 'children.child', select: config.popFields};
                return popChildren(inv, options).then(function (inv) {
                    return mapChildren(base, inv.children);
                })
            })
    }


    /**
     * @param  {array} list - List of base objects
     * @return {object}     - q.all promise that resolves w/ the full
     * list of BOM when all promises have been resolved
     */
    function getChildren(list) {
        var BOM = [];
        var promises = [];
        _.forEach(list, function (item) {
            if (!item) return;
            BOM.push(item);
            promises.push(spreadBom(item));
        });

        return q.all(promises).then(function (list) {
            return _.flatten(BOM.concat(_.compact(list)));
        });
    }

    /**
     *
     * @param  {Object} base - The base path to use
     * @param  {array} list - List of items to use
     * @return {array}      - Mapped list of items
     *
     * refactored serial  2014-05-29
     */
    function mapChildren(base, list) {
        return _.map(list, function (item) {
            var serial=base.serial===''?item[config.serialField]:base.serial + pathsep + item[config.serialField];
            var bomItem = {
                invCode: item.child[config.searchField],
                serial: serial,
                quantity: base.quantity * item[config.quantityField],
                path:base.path+pathsep+item.child[config.searchField]
            };
            var pops = config.popFields.split(' ');
            _.forEach(pops, function (pop) {
              //if(pop!=config.searchField){
                  bomItem[pop]=item.child[pop];
              //}
            });
            return bomItem;
        });
    }

    return spreadBom(base);
};

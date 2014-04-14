'use strict';

/**
 * Created by gong on 14-4-1.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var RouteSchema = new Schema({
    _id: String,
    func: String,
    Route: String
});
RouteSchema.statics = {};
RouteSchema.methods = {};
mongoose.model('Route', RouteSchema);
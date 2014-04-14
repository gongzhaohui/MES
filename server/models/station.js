'use strict';

/**
 * Created by gong on 14-4-1.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var StationSchema = new Schema({
    _id: String,
    station: String
});
StationSchema.statics = {};
StationSchema.methods = {};
mongoose.model('Station', StationSchema);
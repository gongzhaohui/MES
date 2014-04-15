'use strict';

/**
 * Created by gong on 14-4-1.
 * a station is treat as a work center
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var ShiftSchema = new Schema({
    _id:String,
    ref:String,
    ability:Number
});
var StationSchema = new Schema({
    _id: String,
    station: String,
    shifts:[ShiftSchema]
});
StationSchema.statics = {};
StationSchema.methods = {};
mongoose.model('Station', StationSchema);
'use strict';

/**
 * Created by gong on 14-4-1.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var WareHouseSchema = new Schema({
    _id: String,
    WareHouse: String
});
WareHouseSchema.statics = {};
WareHouseSchema.methods = {};
mongoose.model('WareHouse', WareHouseSchema);
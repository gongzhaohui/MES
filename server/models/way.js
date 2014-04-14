'use strict';

/**
 * Created by gong on 14-4-1.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var WaySchema = new Schema({
    _id: String,
    way: String
});
WaySchema.statics = {};
WaySchema.methods = {};
mongoose.model('Way', WaySchema);

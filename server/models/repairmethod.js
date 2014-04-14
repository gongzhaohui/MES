'use strict';

/**
 * Created by gong on 14-4-1.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var RepairMethodSchema = new Schema({
    id: String,
    method: String
});
RepairMethodSchema.statics = {};
RepairMethodSchema.methods = {};
mongoose.model('RepairMethod', RepairMethodSchema);